require("dotenv").config();
const config = require("../../../../../config.js");
const tgToken = process.env.TELEGRAM_TOKEN;
const tgApi = process.env.TELEGRAM_API;
const axios = require("axios").default;
const File = require(`${config.path.model}/file.js`);

class BotController {
  constructor(io) {
    this.ctrler = this.disconnSocketCtrler;
    this.socket = null;

    io.on("connection", (socket) => {
      this.ctrler = this.connSocketCtrler;
      this.socket = socket;

      socket.on("disconnect", () => {
        console.log(`${socket.id}: disconnected`);
        this.ctrler = this.disconnSocketCtrler;
      });
      socket.on("message", (data) => {
        console.log(`${socket.id}: message: ${data}`);
      });
      socket.on("error", (err) => {
        console.error(`${socket.id}: error:`);
        console.error(err);
      });

      socket.on("/rm", async (chatId, audioName) => {
        await File.findOneAndUpdate(
          { name: audioName },
          { status: "removed" }
        ).exec();
        console.log(`${chatId}: /rm "${audioName}"`);
        axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
          chat_id: chatId,
          text: `Removed "${audioName}"`,
        });
      });

      socket.on("/ls", (chatId, command, stdout) => {
        console.log(`${chatId}: ${command}: /ls\n${stdout}`);
        let list = stdout.split("\n");
        list.pop(); // last item is always empty
        if (list.length === 0) {
          axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
            chat_id: chatId,
            text: "No audio to select",
          });
        } else {
          list = list.map((name, index) => {
            return [
              {
                text: name,
                callback_data: `${command}\\${index + 1}\\${name}`,
              },
            ];
          });
          axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
            chat_id: chatId,
            text: `Select audio to ${command}`,
            reply_markup: { inline_keyboard: list },
          });
        }
      });

      socket.on("/dl_status", async (chatId, file) => {
        await File.findByIdAndUpdate(file._id, {
          status: file.status,
          err: file.err,
        }).exec();
        console.log(`${chatId}: /dl_status "${file.name}": ${file.status}`);
        axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
          chat_id: chatId, // capitalize first letter
          text: file.status.charAt(0).toUpperCase() + file.status.slice(1),
        });
      });
    });
  }

  disconnSocketCtrler = async (req, _) => {
    //   const r = await axios.get(`${tgApi}/bot${tgToken}/getUpdates`);
    //   const reqbody = r.data.result.at(-1);
    try {
      await axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
        chat_id: req.body.message.chat.id,
        text: "Player is not connected to the server",
      });
    } catch (err) {
      console.error(err);
    }
  };

  connSocketCtrler = async (req, _) => {
    try {
      //   const r = await axios.get(`${tgApi}/bot${tgToken}/getUpdates`);
      //   const req = { body: r.data.result.at(-1) };
      let audio, audioNumber, audioName, command, chatId;
      if (req.body.message !== undefined) {
        chatId = req.body.message.chat.id;
        command = req.body.message.text;
        audio = req.body.message.audio;
      } else if (req.body.callback_query !== undefined) {
        let split = req.body.callback_query.data.split("\\");
        chatId = req.body.callback_query.message.chat.id;
        command = split[0];
        audioNumber = split[1];
        audioName = split[2];
      }

      if (command !== undefined) {
        switch (command) {
          case "/rm":
            if (audioName !== undefined) {
              console.log(`${chatId}: ${command} "${audioName}"`);
              const file = await File.findOne({ name: audioName }).exec();
              if (file.status === "completed")
                this.socket.emit("/rm", audioName);
              else
                axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
                  chat_id: chatId,
                  text: `Cannot remove "${audioName}". No such file`,
                });
            } else this.socket.emit("/ls", chatId, command);
            break;
          case "/play":
            if (audioNumber !== undefined) {
              console.log(`${chatId}: ${command} ${audioNumber}`);
              this.socket.emit("/play", audioNumber);
            } else this.socket.emit("/ls", chatId, command);
            break;
          case "/rnd":
          case "/rnd on":
          case "/rnd off":
          case "/tgl":
          case "/next":
          case "/prev":
          case "/stop":
            console.log(`${chatId}: ${command}`);
            this.socket.emit(command);
            break;
          case "/dl":
            // let url = new URL(link);
            // audioName = basename(url.pathname).replace(/%20/g, " ");
            // this.socket.emit("/dl", chatId, file);
            break;
          case "/start":
            console.log(`${chatId}: ${command}`);
            const inline_keyboard = [
              [
                { text: "play/pasue", callback_data: `/tgl` },
                { text: "previous", callback_data: `/prev` },
                { text: "next", callback_data: `/next` },
                { text: "stop", callback_data: `/stop` },
              ],
            ];

            axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
              chat_id: chatId,
              text: "­", // invisible character (Alt+0173)
              reply_markup: { inline_keyboard },
            });
            break;
          default:
            const text =
              config.insults[Math.floor(Math.random() * config.insults.length)];
            console.log(`${chatId}: ${text}`);
            axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
              chat_id: chatId,
              text,
            });
        }
      } else if (audio !== undefined) {
        const r = await axios
          .get(`${tgApi}/bot${tgToken}/getFile?file_id=${audio.file_id}`)
          .catch((err) => {
            axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
              chat_id: chatId,
              text: `${err.response.data.error_code}: ${err.response.data.description}`,
            });

            throw "telegram";
          });
        const file_path = r.data.result.file_path;

        const file = await File.create({
          tg_unique_id: audio.file_unique_id,
          name: audio.file_name,
        }).catch(async (err) => {
          if (err && err.code === 11000) {
            let file = await File.findOne({
              tg_unique_id: audio.file_unique_id,
            }).exec();

            let text = "";
            if (file.status === "completed") {
              text = "This file already exists";
            } else if (file.status === "downloading") {
              text = "Still downloading...";
            } else if (file.status === "pending") {
              text = "Still pending...";
            }
            if (text !== "") {
              console.log(`${chatId}: /dl "${file.name}": ${text}`);
              axios.post(`${tgApi}/bot${tgToken}/sendMessage`, {
                chat_id: chatId,
                text,
              });
              throw "duplicate";
            }
            return file;
          }
          throw err;
        });

        console.log(`${chatId}: /dl "${file.name}"`);
        this.socket.emit(
          "/dl",
          chatId,
          file,
          `${tgApi}/file/bot${tgToken}/${file_path}`
        );
      } else {
        console.log(reqbody);
      }
    } catch (err) {
      if (err === "duplicate") {
      } else if (err === "telegram") {
      } else {
        throw err;
      }
    }
  };
}

module.exports = BotController;
