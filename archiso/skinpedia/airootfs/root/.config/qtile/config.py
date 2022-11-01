# Copyright (c) 2010 Aldo Cortesi
# Copyright (c) 2010, 2014 dequis
# Copyright (c) 2012 Randall Ma
# Copyright (c) 2012-2014 Tycho Andersen
# Copyright (c) 2012 Craig Barnes
# Copyright (c) 2013 horsik
# Copyright (c) 2013 Tao Sauvage
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import os
import subprocess
# import iwlib
from typing import List  # noqa: F401n

from libqtile import bar, layout, widget, hook, extension
from libqtile.config import Click, Drag, Group, Key, Match, Screen, ScratchPad, DropDown, KeyChord
from libqtile.lazy import lazy

mod = "mod4"
home = os.path.expanduser('~')

# ==========================================================================================================================
#   Theme
# ==========================================================================================================================

# 2e3e6c telegram

# vscode
# #090b10 deep ocean
# #0f111a ocean
# #80cbc4 teal
# #2d324a button
# #353a49 button hover
# #b8b9b9 text
# #2d324a selected text
# #1a1c25 input

# #juno-ocean
# #0A0B10 dark ocean
# #0E111A ocean
# #00a9a5 teal

colors = {
    "normal": "#0E111A",
    "focus": "#b8b9b9",
    "primary": "#0E111A",
    "secondary": "#0A0B10",
    "select": "#00a9a5",
    "foreground": "#ffffff",
}

widget_defaults = {
    "fontsize": 18,
    "padding": 5,
    "background": colors["primary"],
    "foreground": colors["foreground"]
}
extension_defaults = widget_defaults.copy()

dmenu_defaults = {
    "background": colors["primary"],
    "selected_background": colors["select"],
    "selected_foreground": colors["foreground"],
    "dmenu_bottom": False,
    "fontsize": 10,
    "dmenu_height": 31,
}

groupbox_theme = {
    "borderwidth": 0,
    "hide_unused": True,
    "active": colors["foreground"],
    "inactive": colors["foreground"],
    "highlight_method": "line",
    "highlight_color": colors["select"],
    "urgent_alert_method": "line",
    "urgent_border": colors["select"],
    "urgent_text": colors["foreground"]
}

layout_theme = {
    "border_width": 2,
    "margin": 0,
    "single_border_width": 0,
    "single_margin": 0,
    "border_focus": colors["focus"],
    "border_normal": colors["normal"]
}

# ==========================================================================================================================
#   Key Combination
# ==========================================================================================================================

# terminalEmulator = guess_terminal()
keys = [
    # https://github.com/qtile/qtile/blob/master/libqtile/backend/x11/xkeysyms.py
    # KeyChord([mod], "z", [
    #     Key([], "x", lazy.spawn("xterm"))
    #     # the mode will remain active until the user presses <escape> (i.e. similar to vim modes)
    #     # mode="Windows"
    # ])

    Key([mod, "control"], "Return", lazy.spawn("kitty")),
    Key([mod, "control"], "t", lazy.spawn("kitty")),
    Key([mod, "shift", "control"], "Return", lazy.spawn("xfce4-terminal --hide-menubar")),
    Key([mod, "shift", "control"], "t", lazy.spawn("xfce4-terminal --hide-menubar")),
    Key([mod, "control"], "Delete", lazy.spawn("xkill")),
    Key([mod], "e", lazy.spawn("thunar")),
    Key([mod], "w", lazy.spawn("firefox")),
    Key([mod], "a", lazy.spawn("anki")),
    Key([mod], "z", lazy.spawn("dict-gtk")),
    Key([mod], "s", lazy.spawn("code --extensions-dir "+home+"/.local/share/vscode-oss/extensions")),
    Key([mod], "d", lazy.run_extension(extension.Dmenu(  # -i=case-insensitive -F=fuzzymatch
        **dmenu_defaults, dmenu_command="dmenu_run -i", dmenu_prompt="run"))),
    Key([mod], "c", lazy.run_extension(extension.Dmenu(
        **dmenu_defaults, dmenu_command="clipmenu -i -F", dmenu_prompt="clip "))),
    Key([mod], "x", lazy.run_extension(extension.Dmenu(
        **dmenu_defaults, dmenu_command="passmenu-otp -i -F", dmenu_prompt="pass "))),

    Key([mod], "Print",
        lazy.spawn("sh -c 'xfce4-screenshooter -f -s Downloads/$(date +%Y-%m-%d_%H-%M-%S).jpg'")),
    Key([mod, "control"], "Print",
        lazy.spawn("sh -c 'xfce4-screenshooter -f -s Downloads/$(date +%Y-%m-%d_%H-%M-%S).png'")),
    Key([mod, "shift"], "Print",
        lazy.spawn("sh -c 'xfce4-screenshooter -r -s Downloads/$(date +%Y-%m-%d_%H-%M-%S).jpg'")),
    Key([mod, "shift", "control"], "Print",
        lazy.spawn("sh -c 'xfce4-screenshooter -r -s Downloads/$(date +%Y-%m-%d_%H-%M-%S).png'")),
    # Key([mod], "Delete",
    #     lazy.spawn("sh -c 'kill $(pgrep ffmpeg); \
    #     ffmpeg -f x11grab -framerate 30 -i $DISPLAY -f pulse -i 0 \
    #     -vf scale=-1:240 -c:v h264_nvenc -preset fast -qp 28 -c:a aac \
    #     ~/Downloads/$(date +%Y-%m-%d_%H-%M-%S).mp4'")),
    # Key([mod, "control"], "Delete", lazy.spawn("sh -c 'kill $(pgrep ffmpeg)'")),

    Key([], "XF86AudioMute", lazy.spawn("amixer set Master toggle")),
    Key([], "XF86AudioLowerVolume", lazy.spawn("amixer -D pulse sset Master 5%-")),
    Key([], "XF86AudioRaiseVolume", lazy.spawn("amixer -D pulse sset Master 5%+")),
    Key([], "XF86MonBrightnessUp", lazy.spawn("xbacklight -inc 10")),
    Key([], "XF86MonBrightnessDown", lazy.spawn("xbacklight -dec 10")),
    Key([mod], "0", lazy.spawn("amixer set Master toggle")),
    Key([mod], "minus", lazy.spawn("amixer -D pulse sset Master 5%-")),
    Key([mod], "equal", lazy.spawn("amixer -D pulse sset Master 5%+")),
    Key([mod, "control"], "equal", lazy.spawn("xbacklight -inc 10")),
    Key([mod, "control"], "minus", lazy.spawn("xbacklight -dec 10")),

    Key([mod], "q", lazy.screen.toggle_group()),
    Key([mod], "v", lazy.window.toggle_floating()),
    Key([mod], "f", lazy.window.toggle_fullscreen()),
    Key([mod, "control"], "w", lazy.window.kill()),
    Key([mod], "Tab", lazy.layout.up()),
    Key([mod, "shift"], "Tab", lazy.layout.down()),
    Key([mod, "control"], "Tab", lazy.layout.shuffle_up()),
    Key([mod, "control", "shift"], "Tab", lazy.layout.shuffle_down()),
    Key([mod], "r", lazy.layout.grow_main()),
    Key([mod, "shift"], "r", lazy.layout.shrink_main()),

    Key([mod, "control"], "r", lazy.restart(), lazy.spawn("xsetroot -cursor_name left_ptr")),
    Key([mod, "control"], "q", lazy.spawn("light-locker-command -l")),  # lock
    Key([mod, "control", "shift"], "q", lazy.shutdown()),               # logout
    Key([mod], "Escape", lazy.spawn("systemctl suspend")),              # suspend
    Key([mod, "control"], "Escape", lazy.spawn("shutdown now")),        # shutdown
    Key([mod, "control", "shift"], "Escape",lazy.spawn("reboot")),      # reboot
]

# -------------------------------------------------------------
#
# -------------------------------------------------------------

groups = [Group(i) for i in "1234"]
groups.extend([
    # define a drop down terminal.
    # it is placed in the upper third of screen by default.
    ScratchPad("scratchpad", [
        DropDown("terminal1", "kitty", x=0, y=0, width=1, height=1, opacity=1),
        DropDown("terminal2", "xfce4-terminal --hide-menubar", x=0, y=0, width=1, height=1, opacity=1)
    ]),
])

for i in groups:
    if i.name == "scratchpad":
        continue
    keys.extend([
        # mod1 + letter of group = switch to group
        Key([mod], i.name, lazy.group[i.name].toscreen(toggle=False),
            desc="Switch to group {}".format(i.name)),

        # mod1 + control + letter of group = switch to & move focused window to group
        Key([mod, "control"], i.name, lazy.window.togroup(i.name, switch_group=True),
            desc="Switch to & move focused window to group {}".format(i.name)),
        # Or, use below if you prefer not to switch to that group.
        # # mod1 + shift + letter of group = move focused window to group
        # Key([mod, "shift"], i.name, lazy.window.togroup(i.name),
        #     desc="move focused window to group {}".format(i.name)),
    ])

keys.extend([
    # toggle visibiliy of above defined DropDown named "term"
    # Key([mod], 'F11', lazy.group['scratchpad'].dropdown_toggle('term')),
    Key([mod], "Return", lazy.group["scratchpad"].dropdown_toggle("terminal1")),
    Key([mod, "shift"], "Return", lazy.group["scratchpad"].dropdown_toggle("terminal2")),
    Key([mod], "t", lazy.group["scratchpad"].dropdown_toggle("terminal1")),
    Key([mod, "shift"], "t", lazy.group["scratchpad"].dropdown_toggle("terminal2")),
])

# ==========================================================================================================================
#
# ==========================================================================================================================

layouts = [
    # layout.Columns(border_focus_stack='#d75f5f'),
    # layout.Max(),
    # Try more layouts by unleashing below layouts.
    # layout.Stack(num_stacks=2),
    # layout.Bsp(),
    # layout.Matrix(),
    layout.MonadTall(**layout_theme),
    # layout.MonadWide(),
    # layout.RatioTile(),
    # layout.Tile(),
    # layout.TreeTab(),
    # layout.VerticalTile(),
    # layout.Zoomy(),
]

screens = [
    Screen(
        # top=bar.Bar(
            # [
                # widget.WindowName(padding=6),
                # widget.Net(format="{down} {up}"),
                # # widget.Battery(format='{percent:2.0%}'),
                # widget.Volume(mute_command=""),
                # # widget.Systray(),
                # widget.GroupBox(use_mouse_wheel=False,
                                # disable_drag=True, **groupbox_theme),
                # widget.Clock(format='%Y-%m-%d %a %I:%M %p'),
            # ],
            # size=dmenu_defaults["dmenu_height"],
            # opacity=1
        # ),
    ),
]

# -------------------------------------------------------------
#
# -------------------------------------------------------------

# Drag floating layouts
mouse = [
    Drag([mod], "Button1", lazy.window.set_position_floating(),
         start=lazy.window.get_position()),
    Drag([mod], "Button3", lazy.window.set_size_floating(),
         start=lazy.window.get_size()),
    Click([mod], "Button2", lazy.window.bring_to_front())
]

dgroups_key_binder = None
dgroups_app_rules = []  # type: List
follow_mouse_focus = True
bring_front_click = False
cursor_warp = False
floating_layout = layout.Floating(
    border_width=0,
    border_focus=layout_theme["border_focus"],
    border_normal=layout_theme["border_normal"],
    float_rules=[
        # Run the utility of `xprop` to see the wm class and name of an X client.
        #*layout.Floating.default_float_rules,
        Match(wm_type='utility'),
        Match(wm_type='notification'),
        Match(wm_type='toolbar'),
        Match(wm_type='splash'),
        Match(wm_type='dialog'),
        Match(wm_class='dialog'),
        #Match(wm_class='dict-gtk'),
        Match(wm_class='confirm'),
        Match(wm_class='file_progress'),
        Match(wm_class='download'),
        Match(wm_class='error'),
        Match(wm_class='notification'),
        Match(wm_class='splash'),
        Match(wm_class='toolbar'),
        # Match(func=lambda c: c.has_fixed_size()),
        # Match(func=lambda c: c.has_fixed_ratio()),

        Match(wm_class='confirmreset'),  # gitk
        Match(wm_class='makebranch'),  # gitk
        Match(wm_class='maketag'),  # gitk
        Match(wm_class='ssh-askpass'),  # ssh-askpass
        Match(title='branchdialog'),  # gitk
        Match(title='pinentry'),  # GPG key password entry
        Match(title='Qalculate!'),  # qalculate-gtk
        Match(wm_class='pinentry-gtk-2'),  # GPG key password entry
        Match(wm_class='lxpolkit'),  # sudo password entry
    ]
)
auto_fullscreen = True
focus_on_window_activation = "smart"
reconfigure_screens = True

# If things like steam games want to auto-minimize themselves when losing
# focus, should we respect this or not?
auto_minimize = True

# XXX: Gasp! We're lying here. In fact, nobody really uses or cares about this
# string besides java UI toolkits; you can see several discussions on the
# mailing lists, GitHub issues, and other WM documentation that suggest setting
# this string if your java app doesn't work correctly. We may as well just lie
# and say that we're a working one by default.
#
# We choose LG3D to maximize irony: it is a 3D non-reparenting WM written in
# java that happens to be on java's whitelist.
wmname = "LG3D"

@ hook.subscribe.startup_once
def start_once():
    subprocess.call([home + '/.config/qtile/autostart.sh'])
