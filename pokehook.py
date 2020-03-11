import frida
from subprocess import Popen
import Tkinter as tk
import codecs
import sys
from geopy.geocoders import Nominatim


def key(event):
    # if event.keysym == 'e':
    #    root.destroy()
    #    sys.exit(0)
    if event.keysym == 'Up':
        api.addlati()
    if event.keysym == 'Down':
        api.sublati()
    if event.keysym == 'Left':
        api.sublongi()
    if event.keysym == 'Right':
        api.addlongi()


def getLocation(locname):
    geolocator = Nominatim()
    location = geolocator.geocode(locname)
    return location.latitude, location.longitude


def on_message(message, data):
    try:
        if message:
            print(u"[*] {0}".format(message["payload"]))
    except Exception as e:
        print(message)
        print(e)


if __name__ == "__main__":
    if len(sys.argv) == 2:
        locname = sys.argv[1]
    else:
        locname = ""
    try:
        lati, longi = getLocation(locname)
        Popen(["adb forward tcp:27042 tcp:27042"], shell=True).wait()
        process = frida.get_usb_device().attach("com.nianticlabs.pokemongo")
        with codecs.open('./pokemon.js', 'r', 'utf-8') as f:
            jscode = f.read()
        script = process.create_script(jscode)
        script.on('message', on_message)
        script.load()
        api = script.exports
        print("setting location to: {}".format(locname))

        api.setdefaultloc(lati, longi)
        root = tk.Tk()
        print("Press e key to exit")
        root.bind_all('<Key>', key)
        # root.withdraw()
        root.mainloop()
    except KeyboardInterrupt as e:
        sys.exit(0)
