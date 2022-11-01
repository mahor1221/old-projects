const io = require("socket.io-client");
const { exec } = require("child_process");
const download = require("download");
const home = require("os").homedir();

const socket = io("ws://localhost:11000");
// const socket = io("ws://165.227.101.254:11000");
const proxy = "https://dl.fifthgalaxy.org/bot.php?file=";
const dest = `${home}/Music`;

socket.on("connect", () => {
  socket.send("connected");
  exec("pkill mpd; mpd && mpc update && mpc ls | mpc add", (err) => {
    if (err) {
      socket.emit("error", err);
      socket.disconnect();
    }
  });
});
socket.on("disconnect", () => {
  exec("mpd --kill");
});
socket.on("connect_error", (err) => {
  console.error(`connect_error: ${err}`);
});

socket.on("/rnd", () => {
  exec("mpc random");
});
socket.on("/rnd on", () => {
  exec("mpc random on");
});
socket.on("/rnd off", () => {
  exec("mpc random off");
});
socket.on("/tgl", () => {
  exec("mpc toggle");
});
socket.on("/next", () => {
  exec("mpc next");
});
socket.on("/prev", () => {
  exec("mpc prev");
});
socket.on("/stop", () => {
  exec("mpc stop");
});
socket.on("/ls", (chatId, command) => {
  exec("mpc ls", (err, stdout, stderr) => {
    if (err) socket.emit("error", err);
    else {
      socket.emit("/ls", chatId, command, stdout);
    }
  });
});
socket.on("/play", (audioNumber) => {
  exec(`mpc play ${audioNumber}`);
});
socket.on("/rm", (audioName) => {
  exec(`rm "${dest}/${audioName}"`);
});

socket.on("/dl", async (chatId, file, fileUrl) => {
  socket.emit("/dl_status", chatId, {
    _id: file._id,
    name: file.name,
    status: "downloading",
  });

  await download(`${proxy}${fileUrl}`, dest, { filename: file.name }).catch(
    (err) => {
      socket.emit("/dl_status", chatId, {
        _id: file._id,
        name: file.name,
        status: "failed",
        err,
      });
    }
  );
  socket.emit("/dl_status", chatId, {
    _id: file._id,
    name: file.name,
    status: "completed",
  });
});
