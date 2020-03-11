'use strict';

function toHexString(byteArray)
{
  return byteArray.map(function(byte)
  {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

var lati = 40.7410861;
var longi = -73.9896297241625;

rpc.exports =
{
    setdefaultloc(dlati, dlongi)
    {
        lati = dlati;
        longi = dlongi;
        //send("Lat: " + lati + "    Longi :" + longi);
    },
    addlati()
    {
        lati = lati + 0.0000300;
        send("Move up");
    },
    sublati()
    {
        lati = lati - 0.0000300;
        send("Move down");
    },
    addlongi()
    {
        longi = longi + 0.0000300;
        send("Move right");
    },
    sublongi()
    {
        longi = longi - 0.0000300;
        send("Move left");
    }
};

Dalvik.perform(function() {
    var h_NianticLocationManager = Dalvik.use("com.nianticlabs.nia.location.NianticLocationManager");
    h_NianticLocationManager.locationUpdate.overload("android.location.Location", "[I").implementation = function(s1, s2)
    {
        var hLoc = Java.cast(s1.$handle, Java.use("android.location.Location"));
        hLoc.setLatitude(lati);
        hLoc.setLongitude(longi);
        //var Latitude = hLoc.getLatitude();
        //var Longitude = hLoc.getLongitude();
        //send("La: " + Latitude + "    Long: " + Longitude);
        var ret = this.locationUpdate.overload("android.location.Location", "[I").call(this, s1, s2);
        return ret;
    };


    var h_NiaNet = Dalvik.use("com.nianticlabs.nia.network.NiaNet");
    h_NiaNet.doSyncRequest.overload("long", "int", "java.lang.String", "int", "java.lang.String", "java.nio.ByteBuffer", "int", "int").implementation = function(p_Object, p_request_id, p_url, p_method, p_headers, p_body, p_bodyOffset, p_bodySize)
    {
        //cast ByteBuffer to call later
        var bBuff = Java.cast(p_body.$handle, Java.use("java.nio.ByteBuffer"));
        send("");
        send("-----com.nianticlabs.nia.network.NiaNet.doSyncRequest()-----");
        send("Object: " + p_Object.toString());
        send("request_id: " + p_request_id);
        send("url: " + p_url);
        send("method: " + p_method);

        //loop and store all body buff to array
        var bodyArr = [];
        for (var i = 0; i < p_bodySize; i++)
        {
            bodyArr.push(bBuff.get());
        }

        //print body array
        send("body: " + bodyArr);
        send("");
        //print body array as hex
        send("body as hex: " + toHexString(bodyArr));

        //rewind for game client
        bBuff.rewind();

        var ret = this.doSyncRequest.overload("long", "int", "java.lang.String", "int", "java.lang.String", "java.nio.ByteBuffer", "int", "int").call(this, p_Object, p_request_id, p_url, p_method, p_headers, p_body, p_bodyOffset, p_bodySize);
        //send("Ret :" + ret);
        return ret;
    };
});