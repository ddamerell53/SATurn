var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var console = $global.console || {log:function(){}};
var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
	this.rs = r;
	this.opt = opt;
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,rs: null
	,opt: null
	,regenerate: function() {
		this.r = new RegExp(this.rs,this.opt);
	}
	,hxUnserialize: function(u) {
		this.rs = u.unserialize();
		this.opt = u.unserialize();
	}
	,hxSerialize: function(s) {
		s.serialize(this.rs);
		s.serialize(this.opt);
		this.regenerate();
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js._Boot.HaxeError("EReg::matched");
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw new js._Boot.HaxeError("No string matched");
		return HxOverrides.substr(this.r.s,0,this.r.m.index);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw new js._Boot.HaxeError("No string matched");
		var sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js._Boot.HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = $hxClasses["HxOverrides"] = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js._Boot.HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = $hxClasses["Lambda"] = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,first: function() {
		if(this.h == null) return null; else return this.h[0];
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,__class__: List
};
Math.__name__ = ["Math"];
var Reflect = $hxClasses["Reflect"] = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js._Boot.HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = $hxClasses["Std"] = function() { };
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,toString: function() {
		return this.b;
	}
	,__class__: StringBuf
};
var StringTools = $hxClasses["StringTools"] = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js.Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js._Boot.HaxeError("Too many arguments");
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js._Boot.HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js._Boot.HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js._Boot.HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js.Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var bindings = bindings || {};
bindings.NodeSocket = $hxClasses["bindings.NodeSocket"] = function(nativeSocket) {
	this.theNativeSocket = nativeSocket;
};
bindings.NodeSocket.__name__ = ["bindings","NodeSocket"];
bindings.NodeSocket.prototype = {
	theNativeSocket: null
	,id: null
	,on: function(command,func) {
		this.theNativeSocket.on(command,func);
	}
	,emit: function(command,obj) {
		this.theNativeSocket.emit(command,obj);
	}
	,getId: function() {
		return this.theNativeSocket.id;
	}
	,disconnect: function() {
		this.theNativeSocket.disconnect();
	}
	,__class__: bindings.NodeSocket
};
bindings.NodeFSExtra = $hxClasses["bindings.NodeFSExtra"] = function() { };
bindings.NodeFSExtra.__name__ = ["bindings","NodeFSExtra"];
bindings.NodeFSExtra.copy = function(src,dest,cb) {
	bindings.NodeFSExtra.fsExtra.copy(src,dest,cb);
	return;
};
bindings.NodeTemp = $hxClasses["bindings.NodeTemp"] = function() { };
bindings.NodeTemp.__name__ = ["bindings","NodeTemp"];
bindings.NodeTemp.open = function(prefix,cb) {
	return bindings.NodeTemp.temp.open(prefix,cb);
};
var com = com || {};
if(!com.dongxiguo) com.dongxiguo = {};
if(!com.dongxiguo.continuation) com.dongxiguo.continuation = {};
com.dongxiguo.continuation.Continuation = $hxClasses["com.dongxiguo.continuation.Continuation"] = function() { };
com.dongxiguo.continuation.Continuation.__name__ = ["com","dongxiguo","continuation","Continuation"];
com.dongxiguo.continuation.ContinuationDetail = $hxClasses["com.dongxiguo.continuation.ContinuationDetail"] = function() { };
com.dongxiguo.continuation.ContinuationDetail.__name__ = ["com","dongxiguo","continuation","ContinuationDetail"];
var haxe = haxe || {};
haxe.IMap = $hxClasses["haxe.IMap"] = function() { };
haxe.IMap.__name__ = ["haxe","IMap"];
haxe.IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,__class__: haxe.IMap
};
haxe.Json = $hxClasses["haxe.Json"] = function() { };
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.stringify = function(obj,replacer,insertion) {
	return JSON.stringify(obj,replacer,insertion);
};
haxe.Json.parse = function(jsonString) {
	return JSON.parse(jsonString);
};
haxe.Serializer = $hxClasses["haxe.Serializer"] = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
};
haxe.Serializer.prototype = {
	buf: null
	,cache: null
	,shash: null
	,scount: null
	,useCache: null
	,useEnumIndex: null
	,toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(isNaN(v2)) this.buf.b += "k"; else if(!isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var _g1_head = v3.h;
					var _g1_val = null;
					while(_g1_head != null) {
						var i1;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						i1 = _g1_val;
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(d.getTime());
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						this.serializeString(k);
						this.serialize(__map_reserved[k] != null?v4.getReserved(k):v4.h[k]);
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it1 = v5.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.h[k1]);
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it2 = v6.keys();
					while( $it2.hasNext() ) {
						var k2 = $it2.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(js.Boot.__instanceof(v,Class)) {
					var className = Type.getClassName(v);
					this.buf.b += "A";
					this.serializeString(className);
				} else if(js.Boot.__instanceof(v,Enum)) {
					this.buf.b += "B";
					this.serializeString(Type.getEnumName(v));
				} else {
					if(this.useCache && this.serializeRef(v)) return;
					this.buf.b += "o";
					this.serializeFields(v);
				}
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw new js._Boot.HaxeError("Cannot serialize function");
				break;
			default:
				throw new js._Boot.HaxeError("Cannot serialize " + Std.string(v));
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.Unserializer = $hxClasses["haxe.Unserializer"] = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	buf: null
	,pos: null
	,length: null
	,cache: null
	,scache: null
	,resolver: null
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js._Boot.HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js._Boot.HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js._Boot.HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js._Boot.HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js._Boot.HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js._Boot.HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js._Boot.HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js._Boot.HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js._Boot.HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js._Boot.HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js._Boot.HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js._Boot.HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js._Boot.HaxeError("Invalid bytes length");
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js._Boot.HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js._Boot.HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js._Boot.HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js._Boot.HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js._Boot.HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe.Unserializer
};
if(!haxe.crypto) haxe.crypto = {};
haxe.crypto.Md5 = $hxClasses["haxe.crypto.Md5"] = function() {
};
haxe.crypto.Md5.__name__ = ["haxe","crypto","Md5"];
haxe.crypto.Md5.encode = function(s) {
	var m = new haxe.crypto.Md5();
	var h = m.doEncode(haxe.crypto.Md5.str2blks(s));
	return m.hex(h);
};
haxe.crypto.Md5.str2blks = function(str) {
	var nblk = (str.length + 8 >> 6) + 1;
	var blks = [];
	var blksSize = nblk * 16;
	var _g = 0;
	while(_g < blksSize) {
		var i1 = _g++;
		blks[i1] = 0;
	}
	var i = 0;
	while(i < str.length) {
		blks[i >> 2] |= HxOverrides.cca(str,i) << (str.length * 8 + i) % 4 * 8;
		i++;
	}
	blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
	var l = str.length * 8;
	var k = nblk * 16 - 2;
	blks[k] = l & 255;
	blks[k] |= (l >>> 8 & 255) << 8;
	blks[k] |= (l >>> 16 & 255) << 16;
	blks[k] |= (l >>> 24 & 255) << 24;
	return blks;
};
haxe.crypto.Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,hex: function(a) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < 4) {
				var j = _g1++;
				str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
			}
		}
		return str;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(x) {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return [a,b,c,d];
	}
	,__class__: haxe.crypto.Md5
};
if(!haxe.ds) haxe.ds = {};
haxe.ds.IntMap = $hxClasses["haxe.ds.IntMap"] = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [haxe.IMap];
haxe.ds.IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = $hxClasses["haxe.ds.ObjectMap"] = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [haxe.IMap];
haxe.ds.ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: haxe.ds.ObjectMap
};
if(!haxe.ds._StringMap) haxe.ds._StringMap = {};
haxe.ds._StringMap.StringMapIterator = $hxClasses["haxe.ds._StringMap.StringMapIterator"] = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe.ds._StringMap.StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe.ds._StringMap.StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe.ds._StringMap.StringMapIterator
};
haxe.ds.StringMap = $hxClasses["haxe.ds.StringMap"] = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [haxe.IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		if(__map_reserved[key] != null) {
			key = "$" + key;
			if(this.rh == null || !this.rh.hasOwnProperty(key)) return false;
			delete(this.rh[key]);
			return true;
		} else {
			if(!this.h.hasOwnProperty(key)) return false;
			delete(this.h[key]);
			return true;
		}
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe.ds._StringMap.StringMapIterator(this,this.arrayKeys());
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
	,__class__: haxe.ds.StringMap
};
if(!haxe.io) haxe.io = {};
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	return new haxe.io.Bytes(length,new Buffer(length));
};
haxe.io.Bytes.ofString = function(s) {
	var nb = new Buffer(s,"utf8");
	return new haxe.io.Bytes(nb.length,nb);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.prototype = {
	length: null
	,b: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw new js._Boot.HaxeError(haxe.io.Error.OutsideBounds);
		src.b.copy(this.b,pos,srcpos,srcpos + len);
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js._Boot.HaxeError(haxe.io.Error.OutsideBounds);
		var nb = new Buffer(len);
		var slice = this.b.slice(pos,pos + len);
		slice.copy(nb,0,0,len);
		return new haxe.io.Bytes(len,nb);
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len;
		if(this.length < other.length) len = this.length; else len = other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js._Boot.HaxeError(haxe.io.Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,readString: function(pos,len) {
		return this.getString(pos,len);
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,toHex: function() {
		var s_b = "";
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0;
		var _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g11 = 0;
		var _g2 = this.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			var c = this.b[i1];
			s_b += String.fromCharCode(chars[c >> 4]);
			s_b += String.fromCharCode(chars[c & 15]);
		}
		return s_b;
	}
	,getData: function() {
		return this.b;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
var js = js || {};
if(!js._Boot) js._Boot = {};
js._Boot.HaxeError = $hxClasses["js._Boot.HaxeError"] = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js._Boot.HaxeError);
};
js._Boot.HaxeError.__name__ = ["js","_Boot","HaxeError"];
js._Boot.HaxeError.__super__ = Error;
js._Boot.HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js._Boot.HaxeError
});
js.Boot = $hxClasses["js.Boot"] = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js.Boot.__nativeClassName(o);
		if(name != null) return js.Boot.__resolveNativeClass(name);
		return null;
	}
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js.Boot.__string_rec(o[i1],s); else str2 += js.Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js.Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw new js._Boot.HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js.Boot.__nativeClassName = function(o) {
	var name = js.Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js.Boot.__isNativeObj = function(o) {
	return js.Boot.__nativeClassName(o) != null;
};
js.Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
js.NodeC = $hxClasses["js.NodeC"] = function() { };
js.NodeC.__name__ = ["js","NodeC"];
js.Node = $hxClasses["js.Node"] = function() { };
js.Node.__name__ = ["js","Node"];
js.Node.get_assert = function() {
	return js.Node.require("assert");
};
js.Node.get_child_process = function() {
	return js.Node.require("child_process");
};
js.Node.get_cluster = function() {
	return js.Node.require("cluster");
};
js.Node.get_crypto = function() {
	return js.Node.require("crypto");
};
js.Node.get_dgram = function() {
	return js.Node.require("dgram");
};
js.Node.get_dns = function() {
	return js.Node.require("dns");
};
js.Node.get_fs = function() {
	return js.Node.require("fs");
};
js.Node.get_http = function() {
	return js.Node.require("http");
};
js.Node.get_https = function() {
	return js.Node.require("https");
};
js.Node.get_net = function() {
	return js.Node.require("net");
};
js.Node.get_os = function() {
	return js.Node.require("os");
};
js.Node.get_path = function() {
	return js.Node.require("path");
};
js.Node.get_querystring = function() {
	return js.Node.require("querystring");
};
js.Node.get_repl = function() {
	return js.Node.require("repl");
};
js.Node.get_tls = function() {
	return js.Node.require("tls");
};
js.Node.get_url = function() {
	return js.Node.require("url");
};
js.Node.get_util = function() {
	return js.Node.require("util");
};
js.Node.get_vm = function() {
	return js.Node.require("vm");
};
js.Node.get_zlib = function() {
	return js.Node.require("zlib");
};
js.Node.get___filename = function() {
	return __filename;
};
js.Node.get___dirname = function() {
	return __dirname;
};
js.Node.get_json = function() {
	return JSON;
};
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
};
js.Node.isNodeWebkit = function() {
	return (typeof process == "object");
};
var saturn = saturn || {};
if(!saturn.app) saturn.app = {};
saturn.app.SaturnServer = $hxClasses["saturn.app.SaturnServer"] = function() {
	this.__dirname = __dirname;
	this.restify = js.Node.require("restify");
	this.osLib = js.Node.require("os");
	this.execLib = js.Node.require("child_process");
	this.domainLib = js.Node.require("domain");
	this.httpLib = js.Node.require("http");
	this.cryptoLib = js.Node.require("crypto");
	this.tempLib = js.Node.require("temp");
	this.pathLib = js.Node.require("path");
	this.fsExtraLib = js.Node.require("fs-extra");
	this.fsLib = js.Node.require("fs");
	this.serviceConfigs = new haxe.ds.StringMap();
	this.socketPlugins = [];
	this.plugins = [];
	if(js.Node.process.argv.length == 3) {
		this.servicesFile = js.Node.process.argv[2];
		this.loadServiceDefinition(function() {
		});
	} else {
		this.debug("Usage\tServices File\n");
		js.Node.process.exit(-1);
	}
};
saturn.app.SaturnServer.__name__ = ["saturn","app","SaturnServer"];
saturn.app.SaturnServer.main = function() {
	saturn.app.SaturnServer.defaultServer = new saturn.app.SaturnServer();
};
saturn.app.SaturnServer.getDefaultServer = function() {
	return saturn.app.SaturnServer.defaultServer;
};
saturn.app.SaturnServer.debuglog = function(name,value) {
	saturn.app.SaturnServer.DEBUG(name,value);
};
saturn.app.SaturnServer.getStandardUserInputError = function() {
	return "Invalid User Input";
};
saturn.app.SaturnServer.makeStaticAvailable = function(filePath,cb) {
	var outputPath = saturn.app.SaturnServer.getDefaultServer().getRelativePublicOuputFolder() + "/" + Std.string(saturn.app.SaturnServer.getDefaultServer().pathLib.basename(filePath)) + ".txt";
	var remotePath = saturn.app.SaturnServer.getDefaultServer().getRelativePublicOuputURL() + "/" + Std.string(saturn.app.SaturnServer.getDefaultServer().pathLib.basename(filePath)) + ".txt";
	bindings.NodeFSExtra.copy(filePath,outputPath,function(err) {
		cb(err,remotePath);
	});
};
saturn.app.SaturnServer.prototype = {
	fsLib: null
	,fsExtraLib: null
	,pathLib: null
	,tempLib: null
	,cryptoLib: null
	,httpLib: null
	,domainLib: null
	,execLib: null
	,osLib: null
	,restify: null
	,__dirname: null
	,server: null
	,theServerSocket: null
	,serviceConfigs: null
	,serviceConfig: null
	,servicesFile: null
	,localServerConfig: null
	,port: null
	,redisPort: null
	,socketPlugins: null
	,plugins: null
	,redisClient: null
	,getRedisPort: function() {
		return this.redisPort;
	}
	,getPort: function() {
		return this.port;
	}
	,getHostname: function() {
		return this.getServerConfig().hostname;
	}
	,getServerConfig: function() {
		return this.localServerConfig;
	}
	,initialiseServer: function(index_page) {
		var _g = this;
		var http_config = { };
		var serverConfig = this.getServerConfig();
		if(Object.prototype.hasOwnProperty.call(serverConfig,"restify_http_options")) {
			http_config = Reflect.field(serverConfig,"restify_http_options");
			saturn.core.Util.debug(saturn.core.Util.string(http_config));
		}
		this.server = this.restify.createServer(http_config);
		this.server["use"](this.restify.plugins.bodyParser({ mapParams : true}));
		this.installPlugins();
		this.installSocketPlugins();
		this.server.get(/static\/.*/,this.restify.plugins.serveStatic({ directory : "./public"}));
		this.server.get("/",function(req,res,next) {
			res.header("Location",index_page);
			res.send(302);
			return next(false);
		});
		this.configureRedisClient();
		if(saturn.app.SaturnServer.beforeListen != null) saturn.app.SaturnServer.beforeListen();
		this.server.listen(this.port,serverConfig.hostname,function() {
			_g.debug("Server listening at " + Std.string(_g.server.url));
		});
		if(saturn.app.SaturnServer.afterListen != null) saturn.app.SaturnServer.afterListen();
	}
	,installSocketPlugins: function() {
		var _g = this;
		if(Reflect.hasField(this.getServerConfig(),"socket_plugins")) {
			var pluginDefs = this.getServerConfig().socket_plugins;
			var _g1 = 0;
			while(_g1 < pluginDefs.length) {
				var pluginDef = pluginDefs[_g1];
				++_g1;
				this.debug("PLUGIN: " + Std.string(pluginDef.clazz));
				var plugin = Type.createInstance(Type.resolveClass(pluginDef.clazz),[this,pluginDef]);
				this.socketPlugins.push(plugin);
			}
		}
		var Queue = js.Node.require("bull");
		this.theServerSocket.sockets.on("connection",function(socket) {
			var _g11 = 0;
			var _g2 = _g.socketPlugins;
			while(_g11 < _g2.length) {
				var plugin1 = _g2[_g11];
				++_g11;
				plugin1.addListeners(socket);
			}
		});
	}
	,installPlugins: function() {
		if(Reflect.hasField(this.getServerConfig(),"plugins")) {
			var pluginDefs = this.getServerConfig().plugins;
			var _g = 0;
			while(_g < pluginDefs.length) {
				var pluginDef = pluginDefs[_g];
				++_g;
				this.debug("PLUGIN: " + Std.string(pluginDef.clazz));
				var plugin = Type.createInstance(Type.resolveClass(pluginDef.clazz),[this,pluginDef]);
				this.plugins.push(plugin);
			}
		}
	}
	,loadServiceDefinition: function(__return) {
		var _g = this;
		(function(__afterVar_187) {
			js.Node.require("fs").readFile(_g.servicesFile,"utf8",function(__parameter_188,__parameter_189) {
				__afterVar_187(__parameter_188,__parameter_189);
			});
		})(function(err,content) {
			err;
			content;
			if(err == null) {
				_g.serviceConfig = JSON.parse(content);
				if(Object.prototype.hasOwnProperty.call(_g.serviceConfig,"port")) {
					_g.port = _g.serviceConfig.port;
					if(Object.prototype.hasOwnProperty.call(_g.serviceConfig,"redis_port")) {
						_g.redisPort = _g.serviceConfig.redis_port;
						var value = _g.serviceConfig;
						_g.serviceConfigs.set("localhost: " + _g.port,value);
						_g.localServerConfig = _g.serviceConfig;
						_g.initialiseServer(_g.serviceConfig.index_page);
						__return();
					} else {
						_g.debug("Service config is missing redis_port property");
						js.Node.process.exit(-1);
						__return();
					}
				} else {
					_g.debug("Service config is missing port property");
					js.Node.process.exit(-1);
					__return();
				}
			} else {
				_g.debug(err);
				js.Node.process.exit(-1);
				__return();
			}
		});
	}
	,debug: function(msg) {
		saturn.app.SaturnServer.DEBUG(msg);
	}
	,getStandardErrorCode: function() {
		return "H2IK";
	}
	,getRelativePublicStorageFolder: function() {
		return "public/static";
	}
	,getRelativePublicStorageURL: function() {
		return "static";
	}
	,getRelativePublicOuputFolder: function() {
		return this.getRelativePublicStorageFolder() + "/out";
	}
	,getRelativePublicOuputURL: function() {
		return this.getRelativePublicStorageURL() + "/out";
	}
	,getPythonPath: function() {
		if(js.Node.require("os").platform() == "win32") return "C:/python27/Python.exe"; else return "/opt/python/python_builds/python-2.7.7/bin/python";
	}
	,getServer: function() {
		return this.server;
	}
	,getServerSocket: function() {
		return this.theServerSocket;
	}
	,setServerSocket: function(socket) {
		this.theServerSocket = socket;
	}
	,installLogin: function() {
	}
	,getSocketUser: function(socket,cb) {
		this.isSocketAuthenticated(socket,cb);
	}
	,setUser: function(socket,user) {
		socket.decoded_token = user;
	}
	,isSocketAuthenticated: function(socket,cb) {
		if(socket.decoded_token) {
			var user = this.getSocketUserNoAuthCheck(socket);
			this.isUserAuthenticated(user,cb);
		} else cb(null);
	}
	,getSocketUserNoAuthCheck: function(socket) {
		return socket.decoded_token;
	}
	,isUserAuthenticated: function(user,cb) {
		if(user == null) cb(null); else this.redisClient.get(user.uuid,function(err,reply) {
			if(err || reply == null) cb(null); else cb(user);
		});
	}
	,configureRedisClient: function() {
		var _g = this;
		var redis = js.Node.require("redis");
		this.redisClient = redis.createClient(this.getRedisPort(),this.getHostname());
		this.redisClient.on("error",function(err) {
			_g.debug("Redis Error " + err);
			js.Node.process.exit(-1);
		});
	}
	,getRedisClient: function() {
		return this.redisClient;
	}
	,__class__: saturn.app.SaturnServer
};
if(!saturn.client) saturn.client = {};
if(!saturn.client.core) saturn.client.core = {};
saturn.client.core.CommonCore = $hxClasses["saturn.client.core.CommonCore"] = function() { };
saturn.client.core.CommonCore.__name__ = ["saturn","client","core","CommonCore"];
saturn.client.core.CommonCore.setDefaultProvider = function(provider,name,defaultProvider) {
	if(name == null) name = "DEFAULT";
	saturn.client.core.CommonCore.providers.set(name,provider);
	if(defaultProvider) saturn.client.core.CommonCore.DEFAULT_POOL_NAME = name;
};
saturn.client.core.CommonCore.closeProviders = function() {
	var $it0 = saturn.client.core.CommonCore.providers.keys();
	while( $it0.hasNext() ) {
		var name = $it0.next();
		saturn.client.core.CommonCore.providers.get(name)._closeConnection();
	}
};
saturn.client.core.CommonCore.getStringError = function(error) {
	var dwin = window;
	dwin.error = error;
	return error;
};
saturn.client.core.CommonCore.getCombinedModels = function() {
	if(saturn.client.core.CommonCore.combinedModels == null) {
		saturn.client.core.CommonCore.combinedModels = new haxe.ds.StringMap();
		var _g = 0;
		var _g1 = saturn.client.core.CommonCore.getProviderNames();
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			var models = saturn.client.core.CommonCore.getDefaultProvider(null,name).getModels();
			var $it0 = models.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				var value;
				value = __map_reserved[key] != null?models.getReserved(key):models.h[key];
				saturn.client.core.CommonCore.combinedModels.set(key,value);
			}
		}
	}
	return saturn.client.core.CommonCore.combinedModels;
};
saturn.client.core.CommonCore.getProviderNameForModel = function(name) {
	var models = saturn.client.core.CommonCore.getCombinedModels();
	if(__map_reserved[name] != null?models.existsReserved(name):models.h.hasOwnProperty(name)) {
		if((__map_reserved[name] != null?models.getReserved(name):models.h[name]).exists("provider_name")) return (__map_reserved[name] != null?models.getReserved(name):models.h[name]).get("provider_name"); else return null;
	} else return null;
};
saturn.client.core.CommonCore.getProviderForNamedQuery = function(name) {
	var $it0 = saturn.client.core.CommonCore.providers.keys();
	while( $it0.hasNext() ) {
		var providerName = $it0.next();
		var provider = saturn.client.core.CommonCore.providers.get(providerName);
		var config = provider.getConfig();
		if(Object.prototype.hasOwnProperty.call(config,"named_queries")) {
			if(Reflect.hasField(Reflect.field(config,"named_queries"),name)) return providerName;
		}
	}
	return null;
};
saturn.client.core.CommonCore.getDefaultProvider = function(cb,name) {
	if(name == null) name = saturn.client.core.CommonCore.getDefaultProviderName();
	if(saturn.client.core.CommonCore.providers.exists(name)) {
		if(cb != null) cb(null,saturn.client.core.CommonCore.providers.get(name));
		return saturn.client.core.CommonCore.providers.get(name);
	} else if(name != null) {
		saturn.client.core.CommonCore.getResource(name,cb);
		return -1;
	}
	return null;
};
saturn.client.core.CommonCore.getProviderNames = function() {
	var names = [];
	var $it0 = saturn.client.core.CommonCore.providers.keys();
	while( $it0.hasNext() ) {
		var name = $it0.next();
		names.push(name);
	}
	var $it1 = saturn.client.core.CommonCore.pools.keys();
	while( $it1.hasNext() ) {
		var name1 = $it1.next();
		names.push(name1);
	}
	return names;
};
saturn.client.core.CommonCore.getFileExtension = function(fileName) {
	var r = new EReg("\\.(\\w+)","");
	r.match(fileName);
	return r.matched(1);
};
saturn.client.core.CommonCore.getBinaryFileAsArrayBuffer = function(file) {
	var fileReader = new FileReader();
	return fileReader.readAsArrayBuffer(file);
};
saturn.client.core.CommonCore.convertArrayBufferToBase64 = function(buffer) {
	var binary = "";
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
};
saturn.client.core.CommonCore.getFileAsText = function(file,cb) {
	if(js.Boot.__instanceof(file,saturn.core.FileShim)) cb(file.getAsText()); else if(Object.prototype.hasOwnProperty.call(file,"_data")) cb(file.asText()); else {
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			cb(e.target.result);
		};
		fileReader.readAsText(file);
	}
};
saturn.client.core.CommonCore.getFileInChunks = function(file,chunkSize,cb) {
	var offset = 0;
	var fileSize = file.size;
	var chunker = null;
	chunker = function() {
		var reader = new FileReader();
		reader.readAsDataURL(file.slice(offset,offset + chunkSize));
		reader.onloadend = function(event) {
			if(event.target.error == null) cb(null,reader.result.split(",")[1],function() {
				offset += chunkSize;
				if(offset >= fileSize) cb(null,null,null); else chunker();
			}); else cb(event.target.error,null,null);
		};
	};
	chunker();
};
saturn.client.core.CommonCore.getFileAsArrayBuffer = function(file,cb) {
	if(js.Boot.__instanceof(file,saturn.core.FileShim)) cb(file.getAsArrayBuffer()); else if(Object.prototype.hasOwnProperty.call(file,"_data")) cb(file.asUint8Array()); else {
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			cb(e.target.result);
		};
		fileReader.readAsArrayBuffer(file);
	}
};
saturn.client.core.CommonCore.setPool = function(poolName,pool,isDefault) {
	if(poolName == null) poolName = "DEFAULT";
	saturn.client.core.CommonCore.pools.set(poolName,pool);
	if(isDefault) saturn.client.core.CommonCore.DEFAULT_POOL_NAME = poolName;
};
saturn.client.core.CommonCore.getPool = function(poolName) {
	if(poolName == null) poolName = "DEFAULT";
	if(saturn.client.core.CommonCore.pools.exists(poolName)) return saturn.client.core.CommonCore.pools.get(poolName); else return null;
};
saturn.client.core.CommonCore.getResource = function(poolName,cb) {
	if(poolName == null) poolName = "DEFAULT";
	var pool = saturn.client.core.CommonCore.getPool(poolName);
	if(pool != null) pool.acquire(function(err,resource) {
		if(err == null) saturn.client.core.CommonCore.resourceToPool.set(resource,poolName);
		cb(err,resource);
	}); else cb("Invalid pool name",null);
};
saturn.client.core.CommonCore.releaseResource = function(resource) {
	if(saturn.client.core.CommonCore.resourceToPool.exists(resource)) {
		var poolName = saturn.client.core.CommonCore.resourceToPool.get(resource);
		if(saturn.client.core.CommonCore.pools.exists(poolName)) {
			var pool = saturn.client.core.CommonCore.pools.get(poolName);
			pool.release(resource);
			return -3;
		} else return -2;
	} else return -1;
};
saturn.client.core.CommonCore.makeFullyQualified = function(path) {
	var location = window.location;
	return location.protocol + "//" + location.hostname + ":" + location.port + "/" + path;
};
saturn.client.core.CommonCore.getContent = function(url,onSuccess,onFailure) {
	Ext.Ajax.request({ url : url, success : function(response,opts) {
		onSuccess(response.responseText);
	}, failure : function(response1,opts1) {
		onFailure(response1);
	}});
};
saturn.client.core.CommonCore.getDefaultProviderName = function() {
	return saturn.client.core.CommonCore.DEFAULT_POOL_NAME;
};
if(!saturn.core) saturn.core = {};
saturn.core.Alignment = $hxClasses["saturn.core.Alignment"] = function(seqA,seqB) {
	this.seqID = 0;
	this.lMinScore = 2;
	this.lMaxScore = -1;
	this.lMaxI = 0;
	this.lMaxJ = 0;
	this.localMode = false;
	this.missMatchScore = -2;
	this.matchScore = 1;
	this.gapScore = -1;
	this.sequenceA = seqA.toUpperCase();
	this.sequenceB = seqB.toUpperCase();
	this.localBlocks = [];
};
saturn.core.Alignment.__name__ = ["saturn","core","Alignment"];
saturn.core.Alignment.prototype = {
	sequenceA: null
	,sequenceB: null
	,alnMatrix: null
	,alnDMatrix: null
	,sequenceALen: null
	,sequenceBLen: null
	,gapScore: null
	,matchScore: null
	,missMatchScore: null
	,sequenceAAlnStr: null
	,sequenceBAlnStr: null
	,localMode: null
	,lMaxJ: null
	,lMaxI: null
	,lMaxScore: null
	,lMinScore: null
	,localBlocks: null
	,seqID: null
	,setAlignmentType: function(alnType) {
		if(alnType == saturn.core.AlignmentType.SW) this.localMode = true; else this.localMode = false;
	}
	,getAlignment: function() {
		var localBlock = this.localBlocks[0];
		var retArray = [localBlock.sequenceA,localBlock.sequenceB];
		return retArray;
	}
	,getAlignmentRegion: function() {
		return this.getAlignment();
	}
	,setBlock: function(block) {
		this.localBlocks.push(block);
	}
	,getAllLocalAlignments: function() {
		return this.localBlocks;
	}
	,align: function() {
		this.lMaxJ = 0;
		this.lMaxI = 0;
		this.lMaxScore = -1;
		this.alnMatrix = [];
		this.alnDMatrix = [];
		this.localBlocks = [];
		this.sequenceALen = this.sequenceA.length;
		this.sequenceBLen = this.sequenceB.length;
		var _g1 = 0;
		var _g = this.sequenceBLen + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var iAln = [];
			var iDAln = [];
			var _g3 = 0;
			var _g2 = this.sequenceALen + 1;
			while(_g3 < _g2) {
				var j = _g3++;
				iAln.push(0);
				iDAln.push("");
			}
			this.alnMatrix.push(iAln);
			this.alnDMatrix.push(iDAln);
		}
		this.alnMatrix[0][0] = 0;
		this.alnDMatrix[0][0] = "N";
		var _g11 = 1;
		var _g4 = this.sequenceALen + 1;
		while(_g11 < _g4) {
			var i1 = _g11++;
			this.alnMatrix[0][i1] = i1 * this.gapScore;
			this.alnDMatrix[0][i1] = "L";
		}
		var _g12 = 1;
		var _g5 = this.sequenceBLen + 1;
		while(_g12 < _g5) {
			var j1 = _g12++;
			this.alnMatrix[j1][0] = j1 * this.gapScore;
			this.alnDMatrix[j1][0] = "L";
		}
		var _g13 = 1;
		var _g6 = this.sequenceBLen + 1;
		while(_g13 < _g6) {
			var j2 = _g13++;
			var _g31 = 1;
			var _g21 = this.sequenceALen + 1;
			while(_g31 < _g21) {
				var i2 = _g31++;
				var dScore;
				if(this.sequenceB.charAt(j2 - 1) == this.sequenceA.charAt(i2 - 1)) dScore = this.alnMatrix[j2 - 1][i2 - 1] + this.matchScore; else dScore = this.alnMatrix[j2 - 1][i2 - 1] + this.missMatchScore;
				var lScore = this.alnMatrix[j2][i2 - 1] + this.gapScore;
				var uScore = this.alnMatrix[j2 - 1][i2] + this.gapScore;
				if(dScore >= uScore) {
					if(dScore >= lScore) {
						this.alnMatrix[j2][i2] = dScore;
						this.alnDMatrix[j2][i2] = "D";
					} else {
						this.alnMatrix[j2][i2] = lScore;
						this.alnDMatrix[j2][i2] = "L";
					}
				} else if(uScore >= lScore) {
					this.alnMatrix[j2][i2] = uScore;
					this.alnDMatrix[j2][i2] = "U";
				} else {
					this.alnMatrix[j2][i2] = lScore;
					this.alnDMatrix[j2][i2] = "L";
				}
				if(this.localMode) {
					if(0 > this.alnMatrix[j2][i2]) {
						this.alnMatrix[j2][i2] = 0;
						this.alnDMatrix[j2][i2] = "S";
					} else {
						if(this.alnMatrix[j2][i2] > this.lMaxScore) {
							this.lMaxScore = this.alnMatrix[j2][i2];
							this.lMaxJ = j2;
							this.lMaxI = i2;
						}
						if(this.alnMatrix[j2][i2] > this.lMinScore) this.localBlocks.push(new saturn.core.LocalBlock(j2,i2,this.alnMatrix[j2][i2]));
					}
				}
			}
		}
		var blocksToProcess = [];
		if(this.localMode) {
			var scoreToBlocks = new haxe.ds.IntMap();
			var _g14 = 0;
			var _g7 = this.localBlocks.length;
			while(_g14 < _g7) {
				var l = _g14++;
				var localBlock = this.localBlocks[l];
				if(!scoreToBlocks.h.hasOwnProperty(localBlock.score)) {
					var value = [];
					scoreToBlocks.h[localBlock.score] = value;
				}
				scoreToBlocks.h[localBlock.score].push(localBlock);
			}
			var scoreList = [];
			var $it0 = scoreToBlocks.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				scoreList.push(key);
			}
			scoreList.sort(function(a,b) {
				return b - a;
			});
			var _g8 = 0;
			while(_g8 < scoreList.length) {
				var score = scoreList[_g8];
				++_g8;
				var _g15 = 0;
				var _g22 = scoreToBlocks.h[score];
				while(_g15 < _g22.length) {
					var localBlock1 = _g22[_g15];
					++_g15;
					blocksToProcess.push(localBlock1);
				}
			}
		} else blocksToProcess.push(new saturn.core.LocalBlock(this.sequenceBLen,this.sequenceALen,0));
		this.localBlocks = [];
		this.seqID = 0;
		var visitedPositions = new haxe.ds.StringMap();
		var _g16 = 0;
		var _g9 = blocksToProcess.length;
		while(_g16 < _g9) {
			var l1 = _g16++;
			var sequenceAAln = [];
			var sequenceBAln = [];
			var localBlock2 = blocksToProcess[l1];
			var i3 = localBlock2.iPosition;
			var j3 = localBlock2.jPosition;
			var breaked = false;
			while(true) if(this.alnDMatrix[j3][i3] == "N" || this.alnDMatrix[j3][i3] == "S" || 0 > i3) break; else if(this.alnDMatrix[j3][i3] == "D") {
				if(visitedPositions.exists("I" + Std.string(i3 - 1))) {
					breaked = true;
					break;
				} else if(visitedPositions.exists("J" + Std.string(j3 - 1))) {
					breaked = true;
					break;
				}
				visitedPositions.set("I" + Std.string(i3 - 1),"");
				visitedPositions.set("J" + Std.string(j3 - 1),"");
				sequenceAAln.push(this.sequenceA.charAt(i3 - 1));
				sequenceBAln.push(this.sequenceB.charAt(j3 - 1));
				if(this.sequenceA.charAt(i3 - 1) == this.sequenceB.charAt(j3 - 1)) this.seqID++;
				j3--;
				i3--;
			} else if(this.alnDMatrix[j3][i3] == "L") {
				if(visitedPositions.exists("I" + Std.string(i3 - 1))) {
					breaked = true;
					break;
				}
				visitedPositions.set("I" + Std.string(i3 - 1),"");
				sequenceAAln.push(this.sequenceA.charAt(i3 - 1));
				sequenceBAln.push("-");
				i3--;
			} else if(this.alnDMatrix[j3][i3] == "U") {
				if(visitedPositions.exists("J" + Std.string(j3 - 1))) {
					breaked = true;
					break;
				}
				visitedPositions.set("J" + Std.string(j3 - 1),"");
				sequenceBAln.push(this.sequenceB.charAt(j3 - 1));
				sequenceAAln.push("-");
				j3--;
			}
			if(!breaked) {
				sequenceAAln.reverse();
				this.sequenceAAlnStr = sequenceAAln.join("");
				sequenceBAln.reverse();
				this.sequenceBAlnStr = sequenceBAln.join("");
				localBlock2.sequenceA = this.sequenceAAlnStr;
				localBlock2.sequenceB = this.sequenceBAlnStr;
				this.localBlocks.push(localBlock2);
			}
		}
	}
	,getSeqAId: function() {
		return this.seqID / this.sequenceA.length * 100;
	}
	,__class__: saturn.core.Alignment
};
saturn.core.LocalBlock = $hxClasses["saturn.core.LocalBlock"] = function(j,i,hitScore) {
	this.iPosition = i;
	this.jPosition = j;
	this.score = hitScore;
};
saturn.core.LocalBlock.__name__ = ["saturn","core","LocalBlock"];
saturn.core.LocalBlock.prototype = {
	iPosition: null
	,jPosition: null
	,score: null
	,sequenceA: null
	,sequenceB: null
	,__class__: saturn.core.LocalBlock
};
saturn.core.AlignmentType = $hxClasses["saturn.core.AlignmentType"] = { __ename__ : ["saturn","core","AlignmentType"], __constructs__ : ["SW","NW"] };
saturn.core.AlignmentType.SW = ["SW",0];
saturn.core.AlignmentType.SW.toString = $estr;
saturn.core.AlignmentType.SW.__enum__ = saturn.core.AlignmentType;
saturn.core.AlignmentType.NW = ["NW",1];
saturn.core.AlignmentType.NW.toString = $estr;
saturn.core.AlignmentType.NW.__enum__ = saturn.core.AlignmentType;
saturn.core.CutProductDirection = $hxClasses["saturn.core.CutProductDirection"] = { __ename__ : ["saturn","core","CutProductDirection"], __constructs__ : ["UPSTREAM","DOWNSTREAM","UPDOWN"] };
saturn.core.CutProductDirection.UPSTREAM = ["UPSTREAM",0];
saturn.core.CutProductDirection.UPSTREAM.toString = $estr;
saturn.core.CutProductDirection.UPSTREAM.__enum__ = saturn.core.CutProductDirection;
saturn.core.CutProductDirection.DOWNSTREAM = ["DOWNSTREAM",1];
saturn.core.CutProductDirection.DOWNSTREAM.toString = $estr;
saturn.core.CutProductDirection.DOWNSTREAM.__enum__ = saturn.core.CutProductDirection;
saturn.core.CutProductDirection.UPDOWN = ["UPDOWN",2];
saturn.core.CutProductDirection.UPDOWN.toString = $estr;
saturn.core.CutProductDirection.UPDOWN.__enum__ = saturn.core.CutProductDirection;
if(!saturn.core.molecule) saturn.core.molecule = {};
saturn.core.molecule.Molecule = $hxClasses["saturn.core.molecule.Molecule"] = function(seq) {
	this.linked = false;
	this.allowStar = false;
	this.floatAttributes = new haxe.ds.StringMap();
	this.stringAttributes = new haxe.ds.StringMap();
	this.annotations = new haxe.ds.StringMap();
	this.rawAnnotationData = new haxe.ds.StringMap();
	this.annotationCRC = new haxe.ds.StringMap();
	this.setSequence(seq);
};
saturn.core.molecule.Molecule.__name__ = ["saturn","core","molecule","Molecule"];
saturn.core.molecule.Molecule.prototype = {
	sequence: null
	,starPosition: null
	,originalSequence: null
	,linkedOriginField: null
	,sequenceField: null
	,floatAttributes: null
	,stringAttributes: null
	,name: null
	,alternativeName: null
	,annotations: null
	,rawAnnotationData: null
	,annotationCRC: null
	,crc: null
	,allowStar: null
	,parent: null
	,linked: null
	,getValue: function() {
		return this.getSequence();
	}
	,isLinked: function() {
		return this.linked;
	}
	,setParent: function(parent) {
		this.parent = parent;
	}
	,getParent: function() {
		return this.parent;
	}
	,isChild: function() {
		return this.parent != null;
	}
	,setCRC: function(crc) {
		this.crc = crc;
	}
	,updateCRC: function() {
		if(this.sequence != null) this.crc = haxe.crypto.Md5.encode(this.sequence);
	}
	,getAnnotationCRC: function(annotationName) {
		return this.annotationCRC.get(annotationName);
	}
	,getCRC: function() {
		return this.crc;
	}
	,setRawAnnotationData: function(rawAnnotationData,annotationName) {
		var value = rawAnnotationData;
		this.rawAnnotationData.set(annotationName,value);
	}
	,getRawAnnotationData: function(annotationName) {
		return this.rawAnnotationData.get(annotationName);
	}
	,setAllAnnotations: function(annotations) {
		this.removeAllAnnotations();
		var $it0 = annotations.keys();
		while( $it0.hasNext() ) {
			var annotationName = $it0.next();
			this.setAnnotations(__map_reserved[annotationName] != null?annotations.getReserved(annotationName):annotations.h[annotationName],annotationName);
		}
	}
	,removeAllAnnotations: function() {
		var $it0 = this.annotations.keys();
		while( $it0.hasNext() ) {
			var annotationName = $it0.next();
			this.annotations.remove(annotationName);
			this.annotationCRC.remove(annotationName);
		}
	}
	,setAnnotations: function(annotations,annotationName) {
		this.annotations.set(annotationName,annotations);
		var value = this.getCRC();
		this.annotationCRC.set(annotationName,value);
	}
	,getAnnotations: function(name) {
		return this.annotations.get(name);
	}
	,getAllAnnotations: function() {
		return this.annotations;
	}
	,getAlternativeName: function() {
		return this.alternativeName;
	}
	,setAlternativeName: function(altName) {
		this.alternativeName = altName;
	}
	,getMoleculeName: function() {
		return this.name;
	}
	,setMoleculeName: function(name) {
		this.name = name;
	}
	,getName: function() {
		return this.getMoleculeName();
	}
	,setName: function(name) {
		this.setMoleculeName(name);
	}
	,getSequence: function() {
		return this.sequence;
	}
	,setSequence: function(seq) {
		if(seq != null) {
			seq = seq.toUpperCase();
			seq = saturn.core.molecule.Molecule.whiteSpaceReg.replace(seq,"");
			seq = saturn.core.molecule.Molecule.newLineReg.replace(seq,"");
			seq = saturn.core.molecule.Molecule.carLineReg.replace(seq,"");
			this.starPosition = seq.indexOf("*");
			if(!this.allowStar) {
				this.originalSequence = seq;
				seq = saturn.core.molecule.Molecule.reg_starReplace.replace(seq,"");
			}
			this.sequence = seq;
		}
		this.updateCRC();
	}
	,getFirstPosition: function(seq) {
		return this.sequence.indexOf(seq);
	}
	,getLastPosition: function(seq) {
		if(seq == "") return -1;
		var c = 0;
		var lastMatchPos = -1;
		var lastLastMatchPos = -1;
		while(true) {
			lastMatchPos = this.sequence.indexOf(seq,lastMatchPos + 1);
			if(lastMatchPos != -1) {
				lastLastMatchPos = lastMatchPos;
				c++;
			} else break;
		}
		return lastLastMatchPos;
	}
	,getLocusCount: function(seq) {
		if(seq == "") return 0;
		var c = 0;
		var lastMatchPos = -1;
		while(true) {
			lastMatchPos = this.sequence.indexOf(seq,lastMatchPos + 1);
			if(lastMatchPos != -1) c++; else break;
		}
		return c;
	}
	,contains: function(seq) {
		if(this.sequence.indexOf(seq) > -1) return true; else return false;
	}
	,getLength: function() {
		return this.sequence.length;
	}
	,getStarPosition: function() {
		return this.starPosition;
	}
	,setStarPosition: function(starPosition) {
		this.starPosition = starPosition;
	}
	,getStarSequence: function() {
		return this.originalSequence;
	}
	,equals: function(other) {
		if(other.getStarPosition() != this.getStarPosition()) return false; else if(this.getSequence() != other.getSequence()) return false;
		return true;
	}
	,getCutPosition: function(template) {
		if(template.getLocusCount(this.getSequence()) > 0) {
			var siteStartPosition = template.getFirstPosition(this.getSequence());
			return siteStartPosition + this.starPosition;
		} else return -1;
	}
	,getAfterCutSequence: function(template) {
		var cutPosition = this.getCutPosition(template);
		if(cutPosition == -1) return ""; else {
			var seq = template.getSequence();
			return seq.substring(cutPosition,seq.length);
		}
	}
	,getBeforeCutSequence: function(template) {
		var cutPosition = this.getCutPosition(template);
		if(cutPosition == -1) return ""; else {
			var seq = template.getSequence();
			return seq.substring(0,cutPosition);
		}
	}
	,getLastCutPosition: function(template) {
		if(template.getLocusCount(this.getSequence()) > 0) {
			var siteStartPosition = template.getLastPosition(this.getSequence());
			return siteStartPosition + this.starPosition;
		} else return -1;
	}
	,getLastBeforeCutSequence: function(template) {
		var cutPosition = this.getLastCutPosition(template);
		if(cutPosition == -1) return ""; else {
			var seq = template.getSequence();
			return seq.substring(0,cutPosition);
		}
	}
	,getLastAfterCutSequence: function(template) {
		var cutPosition = this.getLastCutPosition(template);
		if(cutPosition == -1) return ""; else {
			var seq = template.getSequence();
			return seq.substring(cutPosition,seq.length);
		}
	}
	,getCutProduct: function(template,direction) {
		if(direction == saturn.core.CutProductDirection.UPSTREAM) return this.getBeforeCutSequence(template); else if(direction == saturn.core.CutProductDirection.DOWNSTREAM) return this.getAfterCutSequence(template); else if(direction == saturn.core.CutProductDirection.UPDOWN) {
			var startPos = this.getCutPosition(template);
			var endPos = this.getLastCutPosition(template) - this.getLength();
			return template.getSequence().substring(startPos,endPos);
		} else return null;
	}
	,getFloatAttribute: function(attr) {
		return this._getFloatAttribute(Std.string(attr));
	}
	,_getFloatAttribute: function(attributeName) {
		if(this.floatAttributes.exists(attributeName)) return this.floatAttributes.get(attributeName);
		return null;
	}
	,setValue: function(value) {
		this.setSequence(value);
	}
	,_setFloatAttribute: function(attributeName,val) {
		this.floatAttributes.set(attributeName,val);
	}
	,setFloatAttribute: function(attr,val) {
		this._setFloatAttribute(Std.string(attr),val);
	}
	,getStringAttribute: function(attr) {
		return this._getStringAttribute(Std.string(attr));
	}
	,_getStringAttribute: function(attributeName) {
		if(this.stringAttributes.exists(attributeName)) return this.stringAttributes.get(attributeName);
		return null;
	}
	,_setStringAttribute: function(attributeName,val) {
		this.stringAttributes.set(attributeName,val);
	}
	,setStringAttribute: function(attr,val) {
		this._setStringAttribute(Std.string(attr),val);
		return;
	}
	,getMW: function() {
		return this.getFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW);
	}
	,findMatchingLocuses: function(locus,mode) {
		var collookup_single = new EReg("^(\\d+)$","");
		if(collookup_single.match(locus)) {
			var num = collookup_single.matched(1);
			var locusPosition = new saturn.core.LocusPosition();
			locusPosition.start = Std.parseInt(num) - 1;
			locusPosition.end = locusPosition.start;
			return [locusPosition];
		}
		var collookup_double = new EReg("^(\\d+)-(\\d+)$","");
		if(collookup_double.match(locus)) {
			var locusPosition1 = new saturn.core.LocusPosition();
			locusPosition1.start = Std.parseInt(collookup_double.matched(1)) - 1;
			locusPosition1.end = Std.parseInt(collookup_double.matched(2)) - 1;
			return [locusPosition1];
		}
		var collookup_toend = new EReg("^(\\d+)-$","");
		if(collookup_toend.match(locus)) {
			var locusPosition2 = new saturn.core.LocusPosition();
			locusPosition2.start = Std.parseInt(collookup_toend.matched(1)) - 1;
			locusPosition2.end = this.getLength() - 1;
			return [locusPosition2];
		}
		var re_missMatchTotal = new EReg("^(\\d+)(.+)","");
		if(mode == null) {
			mode = saturn.core.molecule.MoleculeAlignMode.REGEX;
			if(re_missMatchTotal.match(locus)) mode = saturn.core.molecule.MoleculeAlignMode.SIMPLE;
		}
		if(mode == saturn.core.molecule.MoleculeAlignMode.REGEX) return this.findMatchingLocusesRegEx(locus); else if(mode == saturn.core.molecule.MoleculeAlignMode.SIMPLE) {
			var missMatchesAllowed = 0;
			if(re_missMatchTotal.match(locus)) {
				missMatchesAllowed = Std.parseInt(re_missMatchTotal.matched(1));
				locus = re_missMatchTotal.matched(2);
			}
			return this.findMatchingLocusesSimple(locus,missMatchesAllowed);
		} else return null;
	}
	,findMatchingLocusesSimple: function(locus,missMatchesAllowed) {
		if(missMatchesAllowed == null) missMatchesAllowed = 0;
		var positions = [];
		if(locus == null || locus == "") return positions;
		var currentMissMatches = 0;
		var seqI = -1;
		var lI = -1;
		var startPos = 0;
		var missMatchLimit = missMatchesAllowed + 1;
		var missMatchPositions = [];
		while(true) {
			lI++;
			seqI++;
			if(seqI > this.sequence.length - 1) break;
			if(locus.charAt(lI) != this.sequence.charAt(seqI)) {
				currentMissMatches++;
				missMatchPositions.push(seqI);
			}
			if(lI == 0) startPos = seqI;
			if(currentMissMatches == missMatchLimit) {
				seqI = startPos;
				lI = -1;
				currentMissMatches = 0;
				missMatchPositions = [];
			} else if(lI == locus.length - 1) {
				var locusPosition = new saturn.core.LocusPosition();
				locusPosition.start = startPos;
				locusPosition.end = seqI;
				locusPosition.missMatchPositions = missMatchPositions;
				positions.push(locusPosition);
				lI = -1;
				currentMissMatches = 0;
				missMatchPositions = [];
			}
		}
		return positions;
	}
	,findMatchingLocusesRegEx: function(regex) {
		var r = new EReg(regex,"i");
		var positions = [];
		if(regex == null || regex == "") return positions;
		var offSet = 0;
		var matchAgainst = this.sequence;
		while(matchAgainst != null) if(r.match(matchAgainst)) {
			var locusPosition = new saturn.core.LocusPosition();
			var match = r.matchedPos();
			locusPosition.start = match.pos + offSet;
			locusPosition.end = match.pos + match.len - 1 + offSet;
			offSet = locusPosition.end + 1;
			matchAgainst = r.matchedRight();
			positions.push(locusPosition);
		} else break;
		return positions;
	}
	,updateAnnotations: function(annotationName,config,annotationManager,cb) {
		if(this.getAnnotationCRC(annotationName) == this.getCRC()) cb(null,this.getAnnotations(annotationName)); else annotationManager.annotateMolecule(this,annotationName,config,function(err,res) {
			cb(err,res);
		});
	}
	,__class__: saturn.core.molecule.Molecule
};
saturn.core.DNA = $hxClasses["saturn.core.DNA"] = function(seq) {
	this.reg_tReplace = new EReg("T","g");
	this.proteins = new haxe.ds.StringMap();
	saturn.core.molecule.Molecule.call(this,seq);
};
saturn.core.DNA.__name__ = ["saturn","core","DNA"];
saturn.core.DNA.__super__ = saturn.core.molecule.Molecule;
saturn.core.DNA.prototype = $extend(saturn.core.molecule.Molecule.prototype,{
	protein: null
	,proteins: null
	,addProtein: function(name,protein) {
		if(protein != null) this.proteins.set(name,protein);
	}
	,removeProtein: function(name) {
		this.proteins.remove(name);
	}
	,getProtein: function(name) {
		return this.proteins.get(name);
	}
	,getProteinNames: function() {
		var names = [];
		var $it0 = this.proteins.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			names.push(name);
		}
		return names;
	}
	,getGCFraction: function() {
		var dnaComposition = this.getComposition();
		return (dnaComposition.cCount + dnaComposition.gCount) / this.getLength();
	}
	,reg_tReplace: null
	,convertToRNA: function() {
		return this.reg_tReplace.replace(this.getSequence(),"U");
	}
	,getHydrogenBondCount: function() {
		var dnaComposition = this.getComposition();
		return (dnaComposition.gCount + dnaComposition.cCount) * 3 + (dnaComposition.aCount + dnaComposition.tCount) * 2;
	}
	,getMolecularWeight: function(phosphateAt5Prime) {
		var dnaComposition = this.getComposition();
		var seqMW = 0.0;
		seqMW += dnaComposition.aCount * saturn.core.molecule.MoleculeConstants.aChainMW;
		seqMW += dnaComposition.tCount * saturn.core.molecule.MoleculeConstants.tChainMW;
		seqMW += dnaComposition.gCount * saturn.core.molecule.MoleculeConstants.gChainMW;
		seqMW += dnaComposition.cCount * saturn.core.molecule.MoleculeConstants.cChainMW;
		if(phosphateAt5Prime == false) seqMW -= saturn.core.molecule.MoleculeConstants.PO3;
		seqMW += saturn.core.molecule.MoleculeConstants.OH;
		return seqMW;
	}
	,setSequence: function(sequence) {
		saturn.core.molecule.Molecule.prototype.setSequence.call(this,sequence);
		if(this.isChild()) {
			var p = this.getParent();
			p.dnaSequenceUpdated(this.sequence);
		}
	}
	,proteinSequenceUpdated: function(sequence) {
	}
	,getComposition: function() {
		var aCount = 0;
		var tCount = 0;
		var gCount = 0;
		var cCount = 0;
		var seqLen = this.sequence.length;
		var _g = 0;
		while(_g < seqLen) {
			var i = _g++;
			var nuc = this.sequence.charAt(i);
			switch(nuc) {
			case "A":
				aCount++;
				break;
			case "T":
				tCount++;
				break;
			case "G":
				gCount++;
				break;
			case "C":
				cCount++;
				break;
			case "U":
				tCount++;
				break;
			}
		}
		return new saturn.core.DNAComposition(aCount,tCount,gCount,cCount);
	}
	,getMeltingTemperature: function() {
		var saltConc = 50;
		var primerConc = 500;
		var testTmCalc = new saturn.core.TmCalc();
		return testTmCalc.tmCalculation(this,saltConc,primerConc);
	}
	,findPrimer: function(startPos,minLength,maxLength,minMelting,maxMelting,extensionSequence,minLengthExtended,minMeltingExtended,maxMeltingExtentded) {
		if(maxMeltingExtentded == null) maxMeltingExtentded = -1;
		if(minMeltingExtended == null) minMeltingExtended = -1;
		if(minLengthExtended == null) minLengthExtended = -1;
		var cCount;
		var gCount;
		var tCount;
		var aCount = 0;
		var seq = HxOverrides.substr(this.sequence,startPos - 1,minLength - 1);
		var comp = new saturn.core.DNA(seq).getComposition();
		cCount = comp.cCount;
		gCount = comp.gCount;
		tCount = comp.tCount;
		aCount = comp.aCount;
		var rangeStart = startPos - 1 + minLength - 1;
		var rangeStop = rangeStart + maxLength;
		var _g = rangeStart;
		while(_g < rangeStop) {
			var i = _g++;
			var $char = this.sequence.charAt(i);
			if($char == "C") cCount++; else if($char == "G") gCount++; else if($char == "A") aCount++; else if($char == "T") tCount++;
			seq += $char;
			var mt = new saturn.core.DNA(seq).getMeltingTemperature();
			if(mt > maxMelting) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Maximum melting temperature exceeded")); else if(mt >= minMelting && mt <= maxMelting) {
				if(extensionSequence == null) return seq; else {
					var completeSequence = new saturn.core.DNA(extensionSequence + seq);
					var completeMT = completeSequence.getMeltingTemperature();
					if(completeMT >= minMeltingExtended && completeMT <= maxMeltingExtentded && completeSequence.getLength() >= minLengthExtended) return seq; else if(completeMT < minMeltingExtended) continue; else if(completeMT > maxMeltingExtentded) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Maximum melting temperature for extended primer sequence exceeded")); else if(completeSequence.getLength() < minLengthExtended) continue;
				}
			}
		}
		throw new js._Boot.HaxeError(new saturn.util.HaxeException("Unable to find region with required parameters"));
	}
	,getNumGC: function() {
		var seqLen = this.sequence.length;
		var gcNum = 0;
		var _g = 0;
		while(_g < seqLen) {
			var i = _g++;
			var nuc = this.sequence.charAt(i);
			if(nuc == "G" || nuc == "C") gcNum++;
		}
		return gcNum;
	}
	,getInverse: function() {
		var newSequence_b = "";
		var seqLen = this.sequence.length;
		var _g = 0;
		while(_g < seqLen) {
			var i = _g++;
			var j = seqLen - i - 1;
			var nuc = this.sequence.charAt(j);
			if(nuc == null) newSequence_b += "null"; else newSequence_b += "" + nuc;
		}
		return newSequence_b;
	}
	,getComplement: function() {
		var newSequence_b = "";
		var seqLen = this.sequence.length;
		var _g = 0;
		while(_g < seqLen) {
			var i = _g++;
			var nuc = this.sequence.charAt(i);
			switch(nuc) {
			case "A":
				nuc = "T";
				break;
			case "T":
				nuc = "A";
				break;
			case "G":
				nuc = "C";
				break;
			case "C":
				nuc = "G";
				break;
			}
			if(nuc == null) newSequence_b += "null"; else newSequence_b += "" + nuc;
		}
		return newSequence_b;
	}
	,getInverseComplement: function() {
		var newSequence_b = "";
		var seqLen = this.sequence.length;
		var _g = 0;
		while(_g < seqLen) {
			var i = _g++;
			var j = seqLen - i - 1;
			var nuc = this.sequence.charAt(j);
			switch(nuc) {
			case "A":
				nuc = "T";
				break;
			case "T":
				nuc = "A";
				break;
			case "G":
				nuc = "C";
				break;
			case "C":
				nuc = "G";
				break;
			}
			if(nuc == null) newSequence_b += "null"; else newSequence_b += "" + nuc;
		}
		return newSequence_b;
	}
	,getFirstStartCodonPosition: function(geneticCode) {
		var geneticCode1 = saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(geneticCode);
		var codons = geneticCode1.getStartCodons();
		var minStartPos = -1;
		var $it0 = codons.keys();
		while( $it0.hasNext() ) {
			var codon = $it0.next();
			var index = this.sequence.indexOf(codon);
			if(index > -1) {
				if(minStartPos == -1 || minStartPos > index) minStartPos = index;
			}
		}
		return minStartPos;
	}
	,getTranslation: function(geneticCode,offSetPosition,stopAtFirstStop) {
		if(offSetPosition == null) offSetPosition = 0;
		if(!this.canHaveCodons()) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Unable to translate a sequence with less than 3 nucleotides"));
		var proteinSequenceBuffer_b = "";
		var seqLength = this.sequence.length;
		var finalCodonPosition = seqLength - (seqLength - offSetPosition) % 3;
		var geneticCode1 = saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(geneticCode);
		var startIndex = offSetPosition;
		var stopCodons = geneticCode1.getStopCodons();
		while(startIndex < finalCodonPosition) {
			var endIndex = startIndex + 3;
			var codon = this.sequence.substring(startIndex,endIndex);
			var code = geneticCode1.lookupCodon(codon);
			if(stopAtFirstStop && code == "!") break;
			if(code == null) proteinSequenceBuffer_b += "null"; else proteinSequenceBuffer_b += "" + code;
			startIndex = endIndex;
		}
		return proteinSequenceBuffer_b;
	}
	,getFrameTranslation: function(geneticCode,frame) {
		if(this.sequence == null) return null;
		var offSetPos = 0;
		if(frame == saturn.core.Frame.TWO) offSetPos = 1; else if(frame == saturn.core.Frame.THREE) offSetPos = 2;
		return this.getTranslation(geneticCode,offSetPos,true);
	}
	,getThreeFrameTranslation: function(geneticCode) {
		var threeFrameTranslations = new haxe.ds.StringMap();
		var value = this.getFrameTranslation(geneticCode,saturn.core.Frame.ONE);
		threeFrameTranslations.set(Std.string(saturn.core.Frame.ONE),value);
		var value1 = this.getFrameTranslation(geneticCode,saturn.core.Frame.TWO);
		threeFrameTranslations.set(Std.string(saturn.core.Frame.TWO),value1);
		var value2 = this.getFrameTranslation(geneticCode,saturn.core.Frame.THREE);
		threeFrameTranslations.set(Std.string(saturn.core.Frame.THREE),value2);
		return threeFrameTranslations;
	}
	,getSixFrameTranslation: function(geneticCode) {
		var forwardFrames = this.getThreeFrameTranslation(geneticCode);
		var dnaSeq = this.getInverseComplement();
		var inverseComplementDNAObj = new saturn.core.DNA(dnaSeq);
		var reverseFrames = inverseComplementDNAObj.getThreeFrameTranslation(geneticCode);
		var value;
		value = __map_reserved.ONE != null?reverseFrames.getReserved("ONE"):reverseFrames.h["ONE"];
		if(__map_reserved.ONE_IC != null) forwardFrames.setReserved("ONE_IC",value); else forwardFrames.h["ONE_IC"] = value;
		var value1;
		value1 = __map_reserved.TWO != null?reverseFrames.getReserved("TWO"):reverseFrames.h["TWO"];
		if(__map_reserved.TWO_IC != null) forwardFrames.setReserved("TWO_IC",value1); else forwardFrames.h["TWO_IC"] = value1;
		var value2;
		value2 = __map_reserved.THREE != null?reverseFrames.getReserved("THREE"):reverseFrames.h["THREE"];
		if(__map_reserved.THREE_IC != null) forwardFrames.setReserved("THREE_IC",value2); else forwardFrames.h["THREE_IC"] = value2;
		return forwardFrames;
	}
	,getFirstStartCodonPositionByFrame: function(geneticCode,frame) {
		var startCodons = this.getStartCodonPositions(geneticCode,frame,true);
		if(startCodons.length == 0) return -1; else return startCodons[0];
	}
	,getStartCodonPositions: function(geneticCode,frame,stopAtFirst) {
		var offSet = 0;
		if(frame == saturn.core.Frame.TWO) offSet = 1; else if(frame == saturn.core.Frame.THREE) offSet = 2;
		var seqLength = this.sequence.length;
		var startingIndex = offSet;
		if(seqLength < startingIndex + 3) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Insufficient DNA length to find codon start position for frame " + Std.string(frame)));
		var startCodonPositions = [];
		var finalCodonPosition = seqLength - (seqLength - offSet) % 3;
		var geneticCode1 = saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(geneticCode);
		var startIndex = startingIndex;
		while(startIndex < finalCodonPosition) {
			var endIndex = startIndex + 3;
			var codon = this.sequence.substring(startIndex,endIndex);
			if(geneticCode1.isStartCodon(codon)) {
				startCodonPositions.push(startIndex);
				if(stopAtFirst) break;
			}
			startIndex = endIndex;
		}
		return startCodonPositions;
	}
	,getFirstStopCodonPosition: function(geneticCode,frame) {
		var startCodons = this.getStopCodonPositions(geneticCode,frame,true);
		if(startCodons.isEmpty()) return -1; else return startCodons.first();
	}
	,getStopCodonPositions: function(geneticCode,frame,stopAtFirst) {
		var offSet = 0;
		if(frame == saturn.core.Frame.TWO) offSet = 1; else if(frame == saturn.core.Frame.THREE) offSet = 2;
		var seqLength = this.sequence.length;
		var startingIndex = offSet;
		if(seqLength < startingIndex + 3) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Insufficient DNA length to find codon start position for frame " + Std.string(frame)));
		var startCodonPositions = new List();
		var finalCodonPosition = seqLength - (seqLength - offSet) % 3;
		var geneticCode1 = saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(geneticCode);
		var startIndex = startingIndex;
		while(startIndex < finalCodonPosition) {
			var endIndex = startIndex + 3;
			var codon = this.sequence.substring(startIndex,endIndex);
			if(geneticCode1.isStopCodon(codon)) {
				startCodonPositions.add(startIndex);
				if(stopAtFirst) break;
			}
			startIndex = endIndex;
		}
		return startCodonPositions;
	}
	,canHaveCodons: function() {
		if(this.sequence.length >= 3) return true; else return false;
	}
	,getFrameRegion: function(frame,start,stop) {
		var dnaStart;
		var dnaStop;
		if(frame == saturn.core.Frame.ONE) {
			dnaStart = start * 3 - 2;
			dnaStop = stop * 3;
		} else if(frame == saturn.core.Frame.TWO) {
			dnaStart = start * 3 - 1;
			dnaStop = stop * 3 + 1;
		} else if(frame == saturn.core.Frame.THREE) {
			dnaStart = start * 3;
			dnaStop = stop * 3 + 2;
		} else return null;
		return this.sequence.substring(dnaStart - 1,dnaStop);
	}
	,mutateResidue: function(frame,geneticCode,pos,mutAA) {
		var nucPos = this.getCodonStartPosition(frame,pos);
		if(nucPos >= this.sequence.length) throw new js._Boot.HaxeError(new saturn.util.HaxeException("Sequence not long enough for requested frame and position"));
		var geneticCode1 = saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(geneticCode);
		var codon = geneticCode1.getFirstCodon(mutAA);
		return this.sequence.substring(0,nucPos - 1) + codon + this.sequence.substring(nucPos + 2,this.sequence.length);
	}
	,getCodonStartPosition: function(frame,start) {
		var dnaStart;
		if(frame == saturn.core.Frame.ONE) dnaStart = start * 3 - 2; else if(frame == saturn.core.Frame.TWO) dnaStart = start * 3 - 1; else if(frame == saturn.core.Frame.THREE) dnaStart = start * 3; else return null;
		return dnaStart;
	}
	,getCodonStopPosition: function(frame,stop) {
		var dnaStop;
		if(frame == saturn.core.Frame.ONE) dnaStop = stop * 3; else if(frame == saturn.core.Frame.TWO) dnaStop = stop * 3 + 1; else if(frame == saturn.core.Frame.THREE) dnaStop = stop * 3 + 2; else return null;
		return dnaStop;
	}
	,getRegion: function(start,stop) {
		return HxOverrides.substr(this.sequence,start - 1,stop - start + 1);
	}
	,getFrom: function(start,len) {
		return HxOverrides.substr(this.sequence,start - 1,len);
	}
	,findMatchingLocuses: function(regex,mode) {
		var direction = saturn.core.Direction.Forward;
		if(StringTools.startsWith(regex,"r")) {
			var templateIC = new saturn.core.DNA(this.getInverseComplement());
			var regexIC = regex.substring(1,regex.length);
			var positions = templateIC.findMatchingLocuses(regexIC,mode);
			var length = this.getLength();
			var _g = 0;
			while(_g < positions.length) {
				var position = positions[_g];
				++_g;
				var originalStart = position.start;
				position.start = length - 1 - position.end;
				position.end = length - 1 - originalStart;
				if(position.missMatchPositions != null) {
					var fPositions = [];
					var _g1 = 0;
					var _g2 = position.missMatchPositions;
					while(_g1 < _g2.length) {
						var position1 = _g2[_g1];
						++_g1;
						fPositions.push(length - 1 - position1);
					}
					position.missMatchPositions = fPositions;
				}
			}
			return positions;
		} else return saturn.core.molecule.Molecule.prototype.findMatchingLocuses.call(this,regex);
	}
	,__class__: saturn.core.DNA
});
saturn.core.Frame = $hxClasses["saturn.core.Frame"] = { __ename__ : ["saturn","core","Frame"], __constructs__ : ["ONE","TWO","THREE"] };
saturn.core.Frame.ONE = ["ONE",0];
saturn.core.Frame.ONE.toString = $estr;
saturn.core.Frame.ONE.__enum__ = saturn.core.Frame;
saturn.core.Frame.TWO = ["TWO",1];
saturn.core.Frame.TWO.toString = $estr;
saturn.core.Frame.TWO.__enum__ = saturn.core.Frame;
saturn.core.Frame.THREE = ["THREE",2];
saturn.core.Frame.THREE.toString = $estr;
saturn.core.Frame.THREE.__enum__ = saturn.core.Frame;
saturn.core.Frames = $hxClasses["saturn.core.Frames"] = function() { };
saturn.core.Frames.__name__ = ["saturn","core","Frames"];
saturn.core.Frames.toInt = function(frame) {
	switch(frame[1]) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	}
};
saturn.core.Direction = $hxClasses["saturn.core.Direction"] = { __ename__ : ["saturn","core","Direction"], __constructs__ : ["Forward","Reverse"] };
saturn.core.Direction.Forward = ["Forward",0];
saturn.core.Direction.Forward.toString = $estr;
saturn.core.Direction.Forward.__enum__ = saturn.core.Direction;
saturn.core.Direction.Reverse = ["Reverse",1];
saturn.core.Direction.Reverse.toString = $estr;
saturn.core.Direction.Reverse.__enum__ = saturn.core.Direction;
saturn.core.DNAComposition = $hxClasses["saturn.core.DNAComposition"] = function(aCount,tCount,gCount,cCount) {
	this.aCount = aCount;
	this.tCount = tCount;
	this.gCount = gCount;
	this.cCount = cCount;
};
saturn.core.DNAComposition.__name__ = ["saturn","core","DNAComposition"];
saturn.core.DNAComposition.prototype = {
	aCount: null
	,tCount: null
	,gCount: null
	,cCount: null
	,__class__: saturn.core.DNAComposition
};
saturn.core.GeneticCode = $hxClasses["saturn.core.GeneticCode"] = function() {
	this.codonLookupTable = new haxe.ds.StringMap();
	this.aaToCodonTable = new haxe.ds.StringMap();
	this.startCodons = new haxe.ds.StringMap();
	this.stopCodons = new haxe.ds.StringMap();
	this.populateTable();
};
saturn.core.GeneticCode.__name__ = ["saturn","core","GeneticCode"];
saturn.core.GeneticCode.prototype = {
	codonLookupTable: null
	,aaToCodonTable: null
	,startCodons: null
	,stopCodons: null
	,addStartCodon: function(codon) {
		this.startCodons.set(codon,"1");
	}
	,isStartCodon: function(codon) {
		return this.startCodons.exists(codon);
	}
	,addStopCodon: function(codon) {
		this.stopCodons.set(codon,"1");
	}
	,isStopCodon: function(codon) {
		return this.stopCodons.exists(codon);
	}
	,getStopCodons: function() {
		return this.stopCodons;
	}
	,getCodonCount: function() {
		return Lambda.count(this.codonLookupTable);
	}
	,getStartCodons: function() {
		var clone = new haxe.ds.StringMap();
		var $it0 = this.startCodons.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var value = this.startCodons.get(key);
			if(__map_reserved[key] != null) clone.setReserved(key,value); else clone.h[key] = value;
		}
		return clone;
	}
	,populateTable: function() {
	}
	,lookupCodon: function(codon) {
		if(this.codonLookupTable.exists(codon)) return this.codonLookupTable.get(codon); else return "?";
	}
	,getCodonLookupTable: function() {
		return this.codonLookupTable;
	}
	,getAAToCodonTable: function() {
		return this.aaToCodonTable;
	}
	,getFirstCodon: function(aa) {
		if(this.aaToCodonTable.exists(aa)) {
			var codons = this.aaToCodonTable.get(aa);
			return codons.first();
		} else return null;
	}
	,__class__: saturn.core.GeneticCode
};
saturn.core.StandardGeneticCode = $hxClasses["saturn.core.StandardGeneticCode"] = function() {
	saturn.core.GeneticCode.call(this);
	saturn.core.GeneticCode.prototype.addStartCodon.call(this,"ATG");
	saturn.core.GeneticCode.prototype.addStopCodon.call(this,"TAA");
	saturn.core.GeneticCode.prototype.addStopCodon.call(this,"TGA");
	saturn.core.GeneticCode.prototype.addStopCodon.call(this,"TAG");
};
saturn.core.StandardGeneticCode.__name__ = ["saturn","core","StandardGeneticCode"];
saturn.core.StandardGeneticCode.getDefaultInstance = function() {
	return saturn.core.StandardGeneticCode.instance;
};
saturn.core.StandardGeneticCode.__super__ = saturn.core.GeneticCode;
saturn.core.StandardGeneticCode.prototype = $extend(saturn.core.GeneticCode.prototype,{
	populateTable: function() {
		this.codonLookupTable.set("TTT","F");
		this.codonLookupTable.set("TTC","F");
		this.codonLookupTable.set("TTA","L");
		this.codonLookupTable.set("TTG","L");
		this.codonLookupTable.set("TCT","S");
		this.codonLookupTable.set("TCC","S");
		this.codonLookupTable.set("TCA","S");
		this.codonLookupTable.set("TCG","S");
		this.codonLookupTable.set("TAT","Y");
		this.codonLookupTable.set("TAC","Y");
		this.codonLookupTable.set("TAA","!");
		this.codonLookupTable.set("TAG","!");
		this.codonLookupTable.set("TGT","C");
		this.codonLookupTable.set("TGC","C");
		this.codonLookupTable.set("TGA","!");
		this.codonLookupTable.set("TGG","W");
		this.codonLookupTable.set("CTT","L");
		this.codonLookupTable.set("CTC","L");
		this.codonLookupTable.set("CTA","L");
		this.codonLookupTable.set("CTG","L");
		this.codonLookupTable.set("CCT","P");
		this.codonLookupTable.set("CCC","P");
		this.codonLookupTable.set("CCA","P");
		this.codonLookupTable.set("CCG","P");
		this.codonLookupTable.set("CAT","H");
		this.codonLookupTable.set("CAC","H");
		this.codonLookupTable.set("CAA","Q");
		this.codonLookupTable.set("CAG","Q");
		this.codonLookupTable.set("CGT","R");
		this.codonLookupTable.set("CGC","R");
		this.codonLookupTable.set("CGA","R");
		this.codonLookupTable.set("CGG","R");
		this.codonLookupTable.set("ATT","I");
		this.codonLookupTable.set("ATC","I");
		this.codonLookupTable.set("ATA","I");
		this.codonLookupTable.set("ATG","M");
		this.codonLookupTable.set("ACT","T");
		this.codonLookupTable.set("ACC","T");
		this.codonLookupTable.set("ACA","T");
		this.codonLookupTable.set("ACG","T");
		this.codonLookupTable.set("AAT","N");
		this.codonLookupTable.set("AAC","N");
		this.codonLookupTable.set("AAA","K");
		this.codonLookupTable.set("AAG","K");
		this.codonLookupTable.set("AGT","S");
		this.codonLookupTable.set("AGC","S");
		this.codonLookupTable.set("AGA","R");
		this.codonLookupTable.set("AGG","R");
		this.codonLookupTable.set("GTT","V");
		this.codonLookupTable.set("GTC","V");
		this.codonLookupTable.set("GTA","V");
		this.codonLookupTable.set("GTG","V");
		this.codonLookupTable.set("GCT","A");
		this.codonLookupTable.set("GCC","A");
		this.codonLookupTable.set("GCA","A");
		this.codonLookupTable.set("GCG","A");
		this.codonLookupTable.set("GAT","D");
		this.codonLookupTable.set("GAC","D");
		this.codonLookupTable.set("GAA","E");
		this.codonLookupTable.set("GAG","E");
		this.codonLookupTable.set("GGT","G");
		this.codonLookupTable.set("GGC","G");
		this.codonLookupTable.set("GGA","G");
		this.codonLookupTable.set("GGG","G");
		var $it0 = this.codonLookupTable.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var aa = this.codonLookupTable.get(key);
			if(!this.aaToCodonTable.exists(aa)) {
				var value = new List();
				this.aaToCodonTable.set(aa,value);
			}
			this.aaToCodonTable.get(aa).add(key);
		}
	}
	,__class__: saturn.core.StandardGeneticCode
});
saturn.core.GeneticCodes = $hxClasses["saturn.core.GeneticCodes"] = { __ename__ : ["saturn","core","GeneticCodes"], __constructs__ : ["STANDARD"] };
saturn.core.GeneticCodes.STANDARD = ["STANDARD",0];
saturn.core.GeneticCodes.STANDARD.toString = $estr;
saturn.core.GeneticCodes.STANDARD.__enum__ = saturn.core.GeneticCodes;
saturn.core.GeneticCodeRegistry = $hxClasses["saturn.core.GeneticCodeRegistry"] = function() {
	this.shortNameToCodeObj = new haxe.ds.StringMap();
	var value = saturn.core.StandardGeneticCode.getDefaultInstance();
	this.shortNameToCodeObj.set(Std.string(saturn.core.GeneticCodes.STANDARD),value);
};
saturn.core.GeneticCodeRegistry.__name__ = ["saturn","core","GeneticCodeRegistry"];
saturn.core.GeneticCodeRegistry.getRegistry = function() {
	return saturn.core.GeneticCodeRegistry.CODE_REGISTRY;
};
saturn.core.GeneticCodeRegistry.getDefault = function() {
	return saturn.core.GeneticCodeRegistry.getRegistry().getGeneticCodeByEnum(saturn.core.GeneticCodes.STANDARD);
};
saturn.core.GeneticCodeRegistry.prototype = {
	shortNameToCodeObj: null
	,getGeneticCodeNames: function() {
		var nameList = new List();
		var $it0 = this.shortNameToCodeObj.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			nameList.add(key);
		}
		return nameList;
	}
	,getGeneticCodeByName: function(shortName) {
		if(!this.shortNameToCodeObj.exists(shortName)) throw new js._Boot.HaxeError(new saturn.core.InvalidGeneticCodeException(shortName + " doesn't correspond to a genetic code in the main registry.")); else return this.shortNameToCodeObj.get(shortName);
	}
	,getGeneticCodeByEnum: function(code) {
		return this.getGeneticCodeByName(Std.string(code));
	}
	,__class__: saturn.core.GeneticCodeRegistry
};
if(!saturn.util) saturn.util = {};
saturn.util.HaxeException = $hxClasses["saturn.util.HaxeException"] = function(message) {
	this.errorMessage = message;
};
saturn.util.HaxeException.__name__ = ["saturn","util","HaxeException"];
saturn.util.HaxeException.prototype = {
	errorMessage: null
	,getMessage: function() {
		return this.errorMessage;
	}
	,toString: function() {
		return this.errorMessage;
	}
	,__class__: saturn.util.HaxeException
};
saturn.core.InvalidGeneticCodeException = $hxClasses["saturn.core.InvalidGeneticCodeException"] = function(message) {
	saturn.util.HaxeException.call(this,message);
};
saturn.core.InvalidGeneticCodeException.__name__ = ["saturn","core","InvalidGeneticCodeException"];
saturn.core.InvalidGeneticCodeException.__super__ = saturn.util.HaxeException;
saturn.core.InvalidGeneticCodeException.prototype = $extend(saturn.util.HaxeException.prototype,{
	__class__: saturn.core.InvalidGeneticCodeException
});
saturn.core.InvalidCodonException = $hxClasses["saturn.core.InvalidCodonException"] = function(message) {
	saturn.util.HaxeException.call(this,message);
};
saturn.core.InvalidCodonException.__name__ = ["saturn","core","InvalidCodonException"];
saturn.core.InvalidCodonException.__super__ = saturn.util.HaxeException;
saturn.core.InvalidCodonException.prototype = $extend(saturn.util.HaxeException.prototype,{
	__class__: saturn.core.InvalidCodonException
});
saturn.core.EUtils = $hxClasses["saturn.core.EUtils"] = function() {
};
saturn.core.EUtils.__name__ = ["saturn","core","EUtils"];
saturn.core.EUtils.getProteinsForGene = function(geneId,cb) {
	saturn.core.EUtils.getProteinGIsForGene(geneId,function(err,ids) {
		if(err != null) cb(err,null); else saturn.core.EUtils.getProteinInfo(ids,true,function(err1,objs) {
			cb(err1,objs);
		});
	});
};
saturn.core.EUtils.getProteinInfo = function(ids,lookupDNA,cb) {
	if(lookupDNA == null) lookupDNA = false;
	var c1 = saturn.core.EUtils.eutils.efetch({ db : "protein", id : ids, retmode : "xml"}).then(function(d) {
		if(!Object.prototype.hasOwnProperty.call(d,"GBSet")) {
			cb("Unable to retrieve proteins for  " + ids.toString(),null);
			return;
		}
		var objs;
		if((d.GBSet.GBSeq instanceof Array) && d.GBSet.GBSeq.__enum__ == null) objs = d.GBSet.GBSeq; else objs = [d.GBSet.GBSeq];
		if(objs == null || objs.length == 0) {
			cb("Unable to retrieve proteins for  " + ids.join(","),null);
			return;
		}
		var protObjs = [];
		var _g = 0;
		while(_g < objs.length) {
			var seqObj = objs[_g];
			++_g;
			var protein = new saturn.core.Protein(seqObj.GBSeq_sequence);
			protObjs.push(protein);
			protein.setMoleculeName(Reflect.field(seqObj,"GBSeq_accession-version"));
			if(Object.prototype.hasOwnProperty.call(seqObj,"GBSeq_other-seqids")) {
				var seqIdElems = Reflect.field(Reflect.field(seqObj,"GBSeq_other-seqids"),"GBSeqid");
				var _g1 = 0;
				while(_g1 < seqIdElems.length) {
					var seqIdElem = seqIdElems[_g1];
					++_g1;
					var seqId = seqIdElem;
					if(seqId.indexOf("gi|") == 0) {
						protein.setAlternativeName(seqId);
						break;
					}
				}
			}
			if(Object.prototype.hasOwnProperty.call(seqObj,"GBSeq_feature-table")) {
				var table = Reflect.field(seqObj,"GBSeq_feature-table");
				var features = table.GBFeature;
				var _g11 = 0;
				while(_g11 < features.length) {
					var feature = features[_g11];
					++_g11;
					if(feature.GBFeature_key == "CDS") {
						var feature_quals = feature.GBFeature_quals.GBQualifier;
						var _g2 = 0;
						while(_g2 < feature_quals.length) {
							var feature1 = feature_quals[_g2];
							++_g2;
							if(feature1.GBQualifier_name == "coded_by") {
								var acStr = feature1.GBQualifier_value;
								var parts = acStr.split(":");
								if(parts.length > 2) {
									cb("Parts greater than two for  " + protein.getMoleculeName(),null);
									return;
								} else {
									var dna = new saturn.core.DNA(null);
									var name = parts[0];
									dna.setMoleculeName(name);
									dna.addProtein("default",protein);
									protein.setReferenceCoordinates(parts[1]);
								}
							}
						}
					}
				}
			}
		}
		if(lookupDNA) {
			var dnaRefs = [];
			var _g3 = 0;
			while(_g3 < protObjs.length) {
				var protObj = protObjs[_g3];
				++_g3;
				dnaRefs.push(protObj.getDNA().getMoleculeName());
			}
			saturn.core.EUtils.getDNAForAccessions(dnaRefs,function(err,dnaObjs) {
				if(err != null) cb(err,null); else {
					var refMap = new haxe.ds.StringMap();
					var _g4 = 0;
					while(_g4 < dnaObjs.length) {
						var obj = dnaObjs[_g4];
						++_g4;
						var key = obj.getMoleculeName();
						if(__map_reserved[key] != null) refMap.setReserved(key,obj); else refMap.h[key] = obj;
					}
					var _g5 = 0;
					while(_g5 < protObjs.length) {
						var protObj1 = protObjs[_g5];
						++_g5;
						var dnaAccession = protObj1.getDNA().getMoleculeName();
						if(__map_reserved[dnaAccession] != null?refMap.existsReserved(dnaAccession):refMap.h.hasOwnProperty(dnaAccession)) {
							var dna1;
							dna1 = __map_reserved[dnaAccession] != null?refMap.getReserved(dnaAccession):refMap.h[dnaAccession];
							protObj1.setDNA(dna1);
							var coords = protObj1.getReferenceCoordinates().split("..");
							if(coords.length > 2) {
								cb("Invalid coordinate string for " + protObj1.getMoleculeName() + " " + protObj1.getReferenceCoordinates(),null);
								return;
							}
							dna1.setSequence(dna1.getRegion(Std.parseInt(coords[0]),Std.parseInt(coords[1])));
							var protSeq = dna1.getFrameTranslation(saturn.core.GeneticCodes.STANDARD,saturn.core.Frame.ONE);
						} else {
							cb(dnaAccession + " not found",null);
							return;
						}
					}
					cb(null,protObjs);
				}
			});
		} else cb(null,protObjs);
	});
	c1.catch(function(d){cb(d)});;
};
saturn.core.EUtils.getDNAForAccessions = function(accessions,cb) {
	var c1 = saturn.core.EUtils.eutils.efetch({ db : "nucleotide", id : accessions, retmode : "xml"}).then(function(d) {
		var objs;
		if((d.GBSet.GBSeq instanceof Array) && d.GBSet.GBSeq.__enum__ == null) objs = d.GBSet.GBSeq; else objs = [d.GBSet.GBSeq];
		if(objs == null || objs.length == 0) {
			cb("Unable to retrieve proteins for  " + accessions.join(","),null);
			return;
		}
		var dnaObjs = [];
		var _g = 0;
		while(_g < objs.length) {
			var seqObj = objs[_g];
			++_g;
			var dna = new saturn.core.DNA(seqObj.GBSeq_sequence);
			dnaObjs.push(dna);
			dna.setMoleculeName(Reflect.field(seqObj,"GBSeq_accession-version"));
			if(Object.prototype.hasOwnProperty.call(seqObj,"GBSeq_other-seqids")) {
				var seqIdElems = Reflect.field(Reflect.field(seqObj,"GBSeq_other-seqids"),"GBSeqid");
				var _g1 = 0;
				while(_g1 < seqIdElems.length) {
					var seqIdElem = seqIdElems[_g1];
					++_g1;
					var seqId = seqIdElem;
					if(seqId.indexOf("gi|") == 0) {
						dna.setAlternativeName(seqId);
						break;
					}
				}
			}
		}
		cb(null,dnaObjs);
	});
	c1.catch(function(d){cb(d)});;
};
saturn.core.EUtils.getProteinGIsForGene = function(geneId,cb) {
	var c1 = saturn.core.EUtils.eutils.esearch({ db : "gene", term : geneId}).then(saturn.core.EUtils.eutils.elink({ dbto : "protein"})).then(function(d) {
		saturn.core.Util.debug("");
		var found = false;
		if(Object.prototype.hasOwnProperty.call(d,"linksets")) {
			var linksets = d.linksets;
			if(linksets.length > 0) {
				if(Object.prototype.hasOwnProperty.call(linksets[0],"linksetdbs")) {
					var linksetdbs = linksets[0].linksetdbs;
					if(linksetdbs.length > 0) {
						var _g = 0;
						while(_g < linksetdbs.length) {
							var set = linksetdbs[_g];
							++_g;
							if(set.linkname == "gene_protein_refseq") {
								var ids = set.links;
								cb(null,ids);
								found = true;
								break;
							}
						}
					}
				}
			}
		}
		if(!found) cb("Unable to lookup gene entry " + geneId,null);
	});
	c1.catch(function(d){cb(d)});;
};
saturn.core.EUtils.insertProteins = function(objs,cb) {
	var run = null;
	run = function() {
		if(objs.length == 0) return;
		var protein = objs.pop();
		saturn.core.Util.debug("Inserting: " + protein.getMoleculeName());
		saturn.core.Protein.insertTranslation(protein.getDNA().getMoleculeName(),protein.getDNA().getAlternativeName(),protein.getDNA().getSequence(),"NUCLEOTIDE",protein.getMoleculeName(),protein.getAlternativeName(),protein.getSequence(),"PROTEIN","7158","GENE",function(err) {
			if(err != null) saturn.core.Util.debug(err); else run();
		});
	};
	run();
};
saturn.core.EUtils.getGeneInfo = function(geneId,cb) {
	saturn.core.Util.debug("Fetching gene record (tends to be very slow)");
	var c1 = saturn.core.EUtils.eutils.efetch({ db : "gene", id : geneId}).then(function(d) {
		var set1 = Reflect.field(d,"Entrezgene-Set");
		var set2 = Reflect.field(set1,"Entrezgene");
		var set3 = Reflect.field(set2,"Entrezgene_gene");
		var set4 = Reflect.field(set3,"Gene-ref");
		cb(null,{ symbol : Reflect.field(set4,"Gene-ref_locus"), description : Reflect.field(set4,"Gene-ref_desc")});
	});
	c1.catch(function(d){cb(d)});;
};
saturn.core.EUtils.prototype = {
	__class__: saturn.core.EUtils
};
saturn.core.EntityType = $hxClasses["saturn.core.EntityType"] = function() {
};
saturn.core.EntityType.__name__ = ["saturn","core","EntityType"];
saturn.core.EntityType.prototype = {
	id: null
	,name: null
	,__class__: saturn.core.EntityType
};
saturn.core.FastaEntity = $hxClasses["saturn.core.FastaEntity"] = function(name,sequence) {
	this.theName = name;
	this.theSequence = sequence;
};
saturn.core.FastaEntity.__name__ = ["saturn","core","FastaEntity"];
saturn.core.FastaEntity.handleStrippedNewLines = function(line) {
	var blockSizeCounts = new haxe.ds.IntMap();
	var whiteBlocks = line.split(" ");
	var _g = 0;
	while(_g < whiteBlocks.length) {
		var whiteBlock = whiteBlocks[_g];
		++_g;
		if(!blockSizeCounts.h.hasOwnProperty(whiteBlock.length)) blockSizeCounts.h[whiteBlock.length] = 0;
		var value = blockSizeCounts.h[whiteBlock.length] + 1;
		blockSizeCounts.h[whiteBlock.length] = value;
	}
	var blockLen = 0;
	var blockSizeCountMax = -1;
	var $it0 = blockSizeCounts.keys();
	while( $it0.hasNext() ) {
		var len = $it0.next();
		var blockSizeCount = blockSizeCounts.h[len];
		if(blockSizeCountMax < blockSizeCount) {
			blockSizeCountMax = blockSizeCount;
			blockLen = len;
		}
	}
	var lines = [];
	whiteBlocks.reverse();
	lines.unshift(whiteBlocks.shift());
	var header = "";
	var _g1 = 0;
	while(_g1 < whiteBlocks.length) {
		var whiteBlock1 = whiteBlocks[_g1];
		++_g1;
		if(whiteBlock1.length == blockLen) lines.unshift(whiteBlock1); else header = whiteBlock1 + " " + header;
	}
	lines.unshift(header);
	return lines;
};
saturn.core.FastaEntity.parseFasta = function(contents) {
	var seqObjs = [];
	var currentName = null;
	var currentSeqBuf = new StringBuf();
	var lines = contents.split("\n");
	if(lines.length == 1) lines = saturn.core.FastaEntity.handleStrippedNewLines(lines[0]);
	var numLines = lines.length;
	var _g = 0;
	while(_g < numLines) {
		var i = _g++;
		var seqLine = true;
		var line = lines[i];
		if(line.indexOf(">") > -1) seqLine = false;
		if(seqLine == true) if(line == null) currentSeqBuf.b += "null"; else currentSeqBuf.b += "" + line;
		if(seqLine == false || i == numLines - 1) {
			if(currentName != null) {
				var currentSeq = currentSeqBuf.b;
				if(currentSeq.length > 0) {
					seqObjs.push(new saturn.core.FastaEntity(HxOverrides.substr(currentName,1,currentName.length),currentSeq));
					currentSeqBuf = new StringBuf();
				}
			}
			if(seqLine == false) currentName = line;
		}
	}
	return seqObjs;
};
saturn.core.FastaEntity.formatFastaFile = function(header,sequence) {
	var buf = new StringBuf();
	buf.b += Std.string(">" + header + "\n");
	var sequenceLength = sequence.length - 1;
	var i = 0;
	while(true) {
		var j = i + 50;
		if(j > sequenceLength) j = sequenceLength + 1;
		window.console.log("Hello" + i + "/" + j);
		buf.add(sequence.substring(i,j) + "\n");
		i = j;
		if(i >= sequenceLength + 1) break;
	}
	return buf.b;
};
saturn.core.FastaEntity.prototype = {
	theName: null
	,theSequence: null
	,getName: function() {
		return this.theName;
	}
	,getSequence: function() {
		return this.theSequence;
	}
	,append: function(sequence) {
		this.theSequence = this.theSequence + sequence;
	}
	,guessType: function() {
		var c = 0;
		var l = 1;
		var sLen = this.theSequence.length;
		var pos = 0;
		while(sLen > pos) {
			var res = this.theSequence.charAt(pos);
			if(!saturn.core.FastaEntity.DNA_CHARS.exists(res)) {
				c++;
				if(c > l) return saturn.core.FastaEntryType.PROTEIN;
			}
			pos++;
		}
		return saturn.core.FastaEntryType.DNA;
	}
	,__class__: saturn.core.FastaEntity
};
saturn.core.FastaEntryType = $hxClasses["saturn.core.FastaEntryType"] = { __ename__ : ["saturn","core","FastaEntryType"], __constructs__ : ["DNA","PROTEIN"] };
saturn.core.FastaEntryType.DNA = ["DNA",0];
saturn.core.FastaEntryType.DNA.toString = $estr;
saturn.core.FastaEntryType.DNA.__enum__ = saturn.core.FastaEntryType;
saturn.core.FastaEntryType.PROTEIN = ["PROTEIN",1];
saturn.core.FastaEntryType.PROTEIN.toString = $estr;
saturn.core.FastaEntryType.PROTEIN.__enum__ = saturn.core.FastaEntryType;
saturn.core.FileShim = $hxClasses["saturn.core.FileShim"] = function(name,base64) {
	this.name = name;
	this.base64 = base64;
};
saturn.core.FileShim.__name__ = ["saturn","core","FileShim"];
saturn.core.FileShim.prototype = {
	name: null
	,base64: null
	,getAsText: function() {
		return window.atob(this.base64);
	}
	,getAsArrayBuffer: function() {
		var bstr = window.atob(this.base64);
		var buffer = new Uint8Array(bstr.length);
		var _g1 = 0;
		var _g = bstr.length;
		while(_g1 < _g) {
			var i = _g1++;
			buffer[i] = HxOverrides.cca(bstr,i);
		}
		return buffer;
	}
	,__class__: saturn.core.FileShim
};
saturn.core.Generator = $hxClasses["saturn.core.Generator"] = function(limit) {
	this.limit = limit;
	this.processed = 0;
	this.done = false;
	this.items = [];
	this.maxAtOnce = 1;
};
saturn.core.Generator.__name__ = ["saturn","core","Generator"];
saturn.core.Generator.prototype = {
	limit: null
	,processed: null
	,done: null
	,cb: null
	,endCb: null
	,maxAtOnce: null
	,items: null
	,push: function(item) {
		this.items.push(item);
	}
	,pop: function(item) {
		return this.items.pop();
	}
	,die: function(err) {
		saturn.core.Util.debug(err);
		this.stop(err);
	}
	,stop: function(err) {
		this.finished();
		this.endCb(err);
	}
	,next: function() {
		var _g = this;
		if(this.done && this.items.length == 0 || this.limit != -1 && this.processed == this.limit) {
			this.endCb(null);
			return;
		} else if(this.items.length > 0) {
			if(this.maxAtOnce != 1) {
				var list = [];
				var added = 0;
				while(this.items.length > 0) {
					var item = this.items.pop();
					list.push(item);
					this.processed++;
					added++;
					if(added == this.maxAtOnce) break;
				}
				this.cb(list,function() {
					haxe.Timer.delay($bind(_g,_g.next),1);
				},this);
			} else {
				var item1 = this.items.pop();
				this.processed++;
				this.cb(item1,function() {
					haxe.Timer.delay($bind(_g,_g.next),1);
				},this);
			}
		} else {
			saturn.core.Util.debug("waiting");
			haxe.Timer.delay($bind(this,this.next),100);
		}
	}
	,count: function() {
		return this.processed;
	}
	,setMaxAtOnce: function(maxAtOnce) {
		this.maxAtOnce = maxAtOnce;
	}
	,setLimit: function(limit) {
		this.limit = limit;
	}
	,onEnd: function(cb) {
		this.endCb = cb;
	}
	,onNext: function(cb) {
		this.cb = cb;
		this.next();
	}
	,finished: function() {
		this.done = true;
	}
	,__class__: saturn.core.Generator
};
saturn.core.LocusPosition = $hxClasses["saturn.core.LocusPosition"] = function() {
};
saturn.core.LocusPosition.__name__ = ["saturn","core","LocusPosition"];
saturn.core.LocusPosition.prototype = {
	start: null
	,end: null
	,missMatchPositions: null
	,__class__: saturn.core.LocusPosition
};
saturn.core.Protein = $hxClasses["saturn.core.Protein"] = function(seq) {
	this.max_pH = 13;
	this.min_pH = 3;
	this.threshold = 0.1;
	this.lu_extinction = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		if(__map_reserved.Y != null) _g.setReserved("Y",1490); else _g.h["Y"] = 1490;
		if(__map_reserved.W != null) _g.setReserved("W",5500); else _g.h["W"] = 5500;
		if(__map_reserved.C != null) _g.setReserved("C",125); else _g.h["C"] = 125;
		$r = _g;
		return $r;
	}(this));
	this.lu_charge = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		if(__map_reserved.D != null) _g.setReserved("D",-1); else _g.h["D"] = -1;
		if(__map_reserved.E != null) _g.setReserved("E",-1); else _g.h["E"] = -1;
		if(__map_reserved.H != null) _g.setReserved("H",1); else _g.h["H"] = 1;
		if(__map_reserved.Y != null) _g.setReserved("Y",-1); else _g.h["Y"] = -1;
		if(__map_reserved.K != null) _g.setReserved("K",1); else _g.h["K"] = 1;
		if(__map_reserved.R != null) _g.setReserved("R",1); else _g.h["R"] = 1;
		if(__map_reserved.C != null) _g.setReserved("C",-1); else _g.h["C"] = -1;
		if(__map_reserved["N-Term"] != null) _g.setReserved("N-Term",1); else _g.h["N-Term"] = 1;
		if(__map_reserved["C-Term"] != null) _g.setReserved("C-Term",-1); else _g.h["C-Term"] = -1;
		$r = _g;
		return $r;
	}(this));
	this.lu_pKa = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		if(__map_reserved.D != null) _g.setReserved("D",4.05); else _g.h["D"] = 4.05;
		if(__map_reserved.E != null) _g.setReserved("E",4.45); else _g.h["E"] = 4.45;
		if(__map_reserved.H != null) _g.setReserved("H",5.98); else _g.h["H"] = 5.98;
		if(__map_reserved.Y != null) _g.setReserved("Y",10); else _g.h["Y"] = 10;
		if(__map_reserved.K != null) _g.setReserved("K",10.4); else _g.h["K"] = 10.4;
		if(__map_reserved.R != null) _g.setReserved("R",12.5); else _g.h["R"] = 12.5;
		if(__map_reserved.C != null) _g.setReserved("C",9); else _g.h["C"] = 9;
		if(__map_reserved["N-Term"] != null) _g.setReserved("N-Term",8); else _g.h["N-Term"] = 8;
		if(__map_reserved["C-Term"] != null) _g.setReserved("C-Term",3.55); else _g.h["C-Term"] = 3.55;
		$r = _g;
		return $r;
	}(this));
	this.hydrophobicityLookUp = (function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		if(__map_reserved.A != null) _g.setReserved("A",1.8); else _g.h["A"] = 1.8;
		if(__map_reserved.G != null) _g.setReserved("G",-0.4); else _g.h["G"] = -0.4;
		if(__map_reserved.M != null) _g.setReserved("M",1.9); else _g.h["M"] = 1.9;
		if(__map_reserved.S != null) _g.setReserved("S",-0.8); else _g.h["S"] = -0.8;
		if(__map_reserved.C != null) _g.setReserved("C",2.5); else _g.h["C"] = 2.5;
		if(__map_reserved.H != null) _g.setReserved("H",-3.2); else _g.h["H"] = -3.2;
		if(__map_reserved.N != null) _g.setReserved("N",-3.5); else _g.h["N"] = -3.5;
		if(__map_reserved.T != null) _g.setReserved("T",-0.7); else _g.h["T"] = -0.7;
		if(__map_reserved.D != null) _g.setReserved("D",-3.5); else _g.h["D"] = -3.5;
		if(__map_reserved.I != null) _g.setReserved("I",4.5); else _g.h["I"] = 4.5;
		if(__map_reserved.P != null) _g.setReserved("P",-1.6); else _g.h["P"] = -1.6;
		if(__map_reserved.V != null) _g.setReserved("V",4.2); else _g.h["V"] = 4.2;
		if(__map_reserved.E != null) _g.setReserved("E",-3.5); else _g.h["E"] = -3.5;
		if(__map_reserved.K != null) _g.setReserved("K",-3.9); else _g.h["K"] = -3.9;
		if(__map_reserved.Q != null) _g.setReserved("Q",-3.5); else _g.h["Q"] = -3.5;
		if(__map_reserved.W != null) _g.setReserved("W",-0.9); else _g.h["W"] = -0.9;
		if(__map_reserved.F != null) _g.setReserved("F",2.8); else _g.h["F"] = 2.8;
		if(__map_reserved.L != null) _g.setReserved("L",3.8); else _g.h["L"] = 3.8;
		if(__map_reserved.R != null) _g.setReserved("R",-4.5); else _g.h["R"] = -4.5;
		if(__map_reserved.Y != null) _g.setReserved("Y",-1.3); else _g.h["Y"] = -1.3;
		$r = _g;
		return $r;
	}(this));
	saturn.core.molecule.Molecule.call(this,seq);
};
saturn.core.Protein.__name__ = ["saturn","core","Protein"];
saturn.core.Protein._insertGene = function(geneId,source,cb) {
	var provider = saturn.core.Util.getProvider();
	provider.getById(geneId,saturn.core.domain.Entity,function(obj,err) {
		if(err != null) cb(err); else if(obj != null) cb(null); else {
			var gene = new saturn.core.domain.Entity();
			gene.entityId = geneId;
			gene.source = new saturn.core.domain.DataSource();
			gene.source.name = source;
			gene.entityType = new saturn.core.EntityType();
			gene.entityType.name = "DNA";
			saturn.core.EUtils.getGeneInfo(Std.parseInt(geneId),function(err1,info) {
				gene.altName = info.symbol;
				gene.description = info.description;
				provider.insertObjects([gene],function(err2) {
					cb(err2);
				});
			});
		}
	});
};
saturn.core.Protein.insertTranslation = function(dnaId,dnaAltName,dnaSeq,dnaSource,protId,protAltName,protSeq,protSource,geneId,geneSource,cb) {
	var provider = saturn.core.Util.getProvider();
	saturn.core.Protein._insertGene(geneId,geneSource,function(err) {
		if(err != null) cb(err); else {
			var dna = new saturn.core.domain.Entity();
			dna.entityId = dnaId;
			dna.altName = dnaAltName;
			dna.source = new saturn.core.domain.DataSource();
			dna.source.name = dnaSource;
			dna.entityType = new saturn.core.EntityType();
			dna.entityType.name = "DNA";
			var dna_mol = new saturn.core.domain.Molecule();
			dna_mol.entity = dna;
			dna_mol.sequence = dnaSeq;
			var annotation = new saturn.core.domain.MoleculeAnnotation();
			annotation.entity = dna;
			annotation.referent = new saturn.core.domain.Entity();
			annotation.referent.entityId = geneId;
			annotation.referent.source = new saturn.core.domain.DataSource();
			annotation.referent.source.name = "GENE";
			var prot = new saturn.core.domain.Entity();
			prot.entityId = protId;
			prot.altName = protAltName;
			prot.source = new saturn.core.domain.DataSource();
			prot.source.name = protSource;
			prot.entityType = new saturn.core.EntityType();
			prot.entityType.name = "PROTEIN";
			var prot_mol = new saturn.core.domain.Molecule();
			prot_mol.entity = prot;
			prot_mol.sequence = protSeq;
			var reaction = new saturn.core.Reaction();
			reaction.name = dnaId + "-TRANS";
			reaction.reactionType = new saturn.core.ReactionType();
			reaction.reactionType.name = "TRANSLATION";
			prot.reaction = reaction;
			var reactionComp = new saturn.core.ReactionComponent();
			reactionComp.entity = dna;
			reactionComp.reactionRole = new saturn.core.ReactionRole();
			reactionComp.reactionRole.name = "TEMPLATE";
			reactionComp.reaction = reaction;
			reactionComp.position = 1;
			provider.insertObjects([dna],function(err1) {
				if(err1 != null) cb(err1); else provider.insertObjects([dna_mol],function(err2) {
					if(err2 != null) cb(err2); else provider.insertObjects([reaction],function(err3) {
						if(err3 != null) cb(err3); else provider.insertObjects([reactionComp],function(err4) {
							if(err4 != null) cb(err4); else provider.insertObjects([prot],function(err5) {
								if(err5 != null) cb(err5); else provider.insertObjects([prot_mol],function(err6) {
									if(err6 != null) cb(err6); else provider.insertObjects([annotation],function(err7) {
										if(err7 != null) saturn.core.Util.debug(err7);
										cb(err7);
									});
								});
							});
						});
					});
				});
			});
		}
	});
};
saturn.core.Protein.__super__ = saturn.core.molecule.Molecule;
saturn.core.Protein.prototype = $extend(saturn.core.molecule.Molecule.prototype,{
	dna: null
	,coordinates: null
	,hydrophobicityLookUp: null
	,lu_pKa: null
	,lu_charge: null
	,lu_extinction: null
	,threshold: null
	,min_pH: null
	,max_pH: null
	,setSequence: function(sequence) {
		saturn.core.molecule.Molecule.prototype.setSequence.call(this,sequence);
		if(sequence != null) {
			var mSet = saturn.core.molecule.MoleculeSetRegistry.getStandardMoleculeSet();
			var mw = mSet.getMolecule("H2O").getFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW);
			var _g1 = 0;
			var _g = this.sequence.length;
			while(_g1 < _g) {
				var i = _g1++;
				var molecule = mSet.getMolecule(this.sequence.charAt(i));
				if(molecule != null) mw += molecule.getFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW_CONDESATION); else {
					mw = -1;
					break;
				}
			}
			this.setFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW,mw);
		}
		if(this.isLinked()) {
			var d = this.getParent();
			if(d != null) d.proteinSequenceUpdated(this.sequence);
		}
	}
	,getHydrophobicity: function() {
		var proteinSequence = this.sequence;
		var seqLength = this.sequence.length;
		var totalGravy = 0.0;
		var averageGravy = 0.0;
		var _g = 0;
		while(_g < seqLength) {
			var i = _g++;
			var aminoAcid = HxOverrides.substr(proteinSequence,i,1);
			var hydroValue = this.hydrophobicityLookUp.get(aminoAcid);
			totalGravy += hydroValue;
		}
		averageGravy = totalGravy / seqLength;
		return averageGravy;
	}
	,setDNA: function(dna) {
		this.dna = dna;
	}
	,dnaSequenceUpdated: function(sequence) {
	}
	,getDNA: function() {
		return this.dna;
	}
	,setReferenceCoordinates: function(coordinates) {
		this.coordinates = coordinates;
	}
	,getReferenceCoordinates: function() {
		return this.coordinates;
	}
	,getAminoAcidCharge: function(aa,mid_pH) {
		var aminoAcid = aa;
		var pH = mid_pH;
		var ratio = 1 / (1 + Math.pow(10,pH - this.lu_pKa.get(aminoAcid)));
		if(this.lu_charge.get(aminoAcid) == 1) return ratio; else return ratio - 1;
	}
	,getProteinCharge: function(mid_pH) {
		var seqLength = this.sequence.length;
		var proteinSequence = this.sequence;
		var aa = "N-Term";
		var proteinCharge = this.getAminoAcidCharge(aa,mid_pH);
		aa = "C-Term";
		proteinCharge += this.getAminoAcidCharge(aa,mid_pH);
		var _g = 0;
		while(_g < seqLength) {
			var i = _g++;
			aa = HxOverrides.substr(proteinSequence,i,1);
			if(this.lu_pKa.exists(aa)) proteinCharge += this.getAminoAcidCharge(aa,mid_pH);
		}
		return proteinCharge;
	}
	,getpI: function() {
		var proteinSequence = this.sequence;
		while(true) {
			var mid_pH = 0.5 * (this.max_pH + this.min_pH);
			var proteinCharge = this.getProteinCharge(mid_pH);
			if(proteinCharge > this.threshold) this.min_pH = mid_pH; else if(proteinCharge < -this.threshold) this.max_pH = mid_pH; else return mid_pH;
		}
	}
	,getExtinctionNonReduced: function() {
		var proteinSequence = this.sequence;
		var seqLength = this.sequence.length;
		var aa;
		var extinctionNonReduced = 0.0;
		var numberCysteines = 0.0;
		var pairsCysteins = 0.0;
		var _g = 0;
		while(_g < seqLength) {
			var i = _g++;
			aa = HxOverrides.substr(proteinSequence,i,1);
			if(this.lu_extinction.exists(aa) && aa != "C") extinctionNonReduced += this.lu_extinction.get(aa);
			if(aa == "C") numberCysteines += 1;
		}
		if(numberCysteines % 2 == 0) pairsCysteins = numberCysteines / 2; else pairsCysteins = numberCysteines / 2 - 0.5;
		extinctionNonReduced += pairsCysteins * this.lu_extinction.get("C");
		return extinctionNonReduced;
	}
	,getExtinctionReduced: function() {
		var proteinSequence = this.sequence;
		var seqLength = this.sequence.length;
		var aa;
		var extinctionReduced = 0.0;
		var _g = 0;
		while(_g < seqLength) {
			var i = _g++;
			aa = HxOverrides.substr(proteinSequence,i,1);
			if(this.lu_extinction.exists(aa) && aa != "C") extinctionReduced += this.lu_extinction.get(aa);
		}
		return extinctionReduced;
	}
	,__class__: saturn.core.Protein
});
saturn.core.Reaction = $hxClasses["saturn.core.Reaction"] = function() {
};
saturn.core.Reaction.__name__ = ["saturn","core","Reaction"];
saturn.core.Reaction.prototype = {
	id: null
	,name: null
	,reactionTypeId: null
	,reactionType: null
	,__class__: saturn.core.Reaction
};
saturn.core.ReactionComponent = $hxClasses["saturn.core.ReactionComponent"] = function() {
};
saturn.core.ReactionComponent.__name__ = ["saturn","core","ReactionComponent"];
saturn.core.ReactionComponent.prototype = {
	id: null
	,position: null
	,reactionRoleId: null
	,entityId: null
	,reactionId: null
	,reaction: null
	,reactionRole: null
	,entity: null
	,__class__: saturn.core.ReactionComponent
};
saturn.core.ReactionRole = $hxClasses["saturn.core.ReactionRole"] = function() {
};
saturn.core.ReactionRole.__name__ = ["saturn","core","ReactionRole"];
saturn.core.ReactionRole.prototype = {
	id: null
	,name: null
	,__class__: saturn.core.ReactionRole
};
saturn.core.ReactionType = $hxClasses["saturn.core.ReactionType"] = function() {
};
saturn.core.ReactionType.__name__ = ["saturn","core","ReactionType"];
saturn.core.ReactionType.prototype = {
	id: null
	,name: null
	,__class__: saturn.core.ReactionType
};
saturn.core.RestrictionSite = $hxClasses["saturn.core.RestrictionSite"] = function(seq) {
	saturn.core.DNA.call(this,seq);
};
saturn.core.RestrictionSite.__name__ = ["saturn","core","RestrictionSite"];
saturn.core.RestrictionSite.__super__ = saturn.core.DNA;
saturn.core.RestrictionSite.prototype = $extend(saturn.core.DNA.prototype,{
	__class__: saturn.core.RestrictionSite
});
saturn.core.molecule.MoleculeSet = $hxClasses["saturn.core.molecule.MoleculeSet"] = function() {
	this.moleculeSet = new haxe.ds.StringMap();
};
saturn.core.molecule.MoleculeSet.__name__ = ["saturn","core","molecule","MoleculeSet"];
saturn.core.molecule.MoleculeSet.prototype = {
	moleculeSet: null
	,setMolecule: function(name,molecule) {
		this.moleculeSet.set(name,molecule);
	}
	,getMolecule: function(name) {
		return this.moleculeSet.get(name);
	}
	,__class__: saturn.core.molecule.MoleculeSet
};
saturn.core.StandardMoleculeSet = $hxClasses["saturn.core.StandardMoleculeSet"] = function() {
	saturn.core.molecule.MoleculeSet.call(this);
	var mMap = [{ 'NAME' : "A", 'MW' : 71.0788},{ 'NAME' : "R", 'MW' : 156.1875},{ 'NAME' : "N", 'MW' : 114.1038},{ 'NAME' : "D", 'MW' : 115.0886},{ 'NAME' : "C", 'MW' : 103.1448},{ 'NAME' : "E", 'MW' : 129.1155},{ 'NAME' : "Q", 'MW' : 128.1308},{ 'NAME' : "G", 'MW' : 57.052},{ 'NAME' : "H", 'MW' : 137.1412},{ 'NAME' : "I", 'MW' : 113.1595},{ 'NAME' : "L", 'MW' : 113.1595},{ 'NAME' : "K", 'MW' : 128.1742},{ 'NAME' : "M", 'MW' : 131.1986},{ 'NAME' : "F", 'MW' : 147.1766},{ 'NAME' : "P", 'MW' : 97.1167},{ 'NAME' : "S", 'MW' : 87.0782},{ 'NAME' : "T", 'MW' : 101.1051},{ 'NAME' : "W", 'MW' : 186.2133},{ 'NAME' : "Y", 'MW' : 163.176},{ 'NAME' : "V", 'MW' : 99.1326}];
	var _g = 0;
	while(_g < mMap.length) {
		var mDef = mMap[_g];
		++_g;
		var m = new saturn.core.molecule.Molecule(mDef.NAME);
		m.setFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW_CONDESATION,mDef.MW);
		m.setStringAttribute(saturn.core.molecule.MoleculeStringAttribute.NAME,mDef.NAME);
		this.setMolecule(mDef.NAME,m);
	}
	mMap = [{ 'NAME' : "H2O", 'MW' : 18.02}];
	var _g1 = 0;
	while(_g1 < mMap.length) {
		var mDef1 = mMap[_g1];
		++_g1;
		var m1 = new saturn.core.molecule.Molecule(mDef1.NAME);
		m1.setFloatAttribute(saturn.core.molecule.MoleculeFloatAttribute.MW,mDef1.MW);
		m1.setStringAttribute(saturn.core.molecule.MoleculeStringAttribute.NAME,mDef1.NAME);
		this.setMolecule(mDef1.NAME,m1);
	}
};
saturn.core.StandardMoleculeSet.__name__ = ["saturn","core","StandardMoleculeSet"];
saturn.core.StandardMoleculeSet.__super__ = saturn.core.molecule.MoleculeSet;
saturn.core.StandardMoleculeSet.prototype = $extend(saturn.core.molecule.MoleculeSet.prototype,{
	__class__: saturn.core.StandardMoleculeSet
});
saturn.core.TmCalc = $hxClasses["saturn.core.TmCalc"] = function() {
	this.deltaHTable = new haxe.ds.StringMap();
	this.deltaSTable = new haxe.ds.StringMap();
	this.endHTable = new haxe.ds.StringMap();
	this.endSTable = new haxe.ds.StringMap();
	this.populateDeltaHTable();
	this.populateDeltaSTable();
	this.populateEndHTable();
	this.populateEndSTable();
};
saturn.core.TmCalc.__name__ = ["saturn","core","TmCalc"];
saturn.core.TmCalc.prototype = {
	deltaHTable: null
	,deltaSTable: null
	,endHTable: null
	,endSTable: null
	,populateDeltaHTable: function() {
		this.deltaHTable.set("AA",-7900);
		this.deltaHTable.set("TT",-7900);
		this.deltaHTable.set("AT",-7200);
		this.deltaHTable.set("TA",-7200);
		this.deltaHTable.set("CA",-8500);
		this.deltaHTable.set("TG",-8500);
		this.deltaHTable.set("GT",-8400);
		this.deltaHTable.set("AC",-8400);
		this.deltaHTable.set("CT",-7800);
		this.deltaHTable.set("AG",-7800);
		this.deltaHTable.set("GA",-8200);
		this.deltaHTable.set("TC",-8200);
		this.deltaHTable.set("CG",-10600);
		this.deltaHTable.set("GC",-9800);
		this.deltaHTable.set("GG",-8000);
		this.deltaHTable.set("CC",-8000);
	}
	,populateDeltaSTable: function() {
		this.deltaSTable.set("AA",-22.2);
		this.deltaSTable.set("TT",-22.2);
		this.deltaSTable.set("AT",-20.4);
		this.deltaSTable.set("TA",-21.3);
		this.deltaSTable.set("CA",-22.7);
		this.deltaSTable.set("TG",-22.7);
		this.deltaSTable.set("GT",-22.4);
		this.deltaSTable.set("AC",-22.4);
		this.deltaSTable.set("CT",-21.0);
		this.deltaSTable.set("AG",-21.0);
		this.deltaSTable.set("GA",-22.2);
		this.deltaSTable.set("TC",-22.2);
		this.deltaSTable.set("CG",-27.2);
		this.deltaSTable.set("GC",-24.4);
		this.deltaSTable.set("GG",-19.9);
		this.deltaSTable.set("CC",-19.9);
	}
	,populateEndHTable: function() {
		this.endHTable.set("A",2300);
		this.endHTable.set("T",2300);
		this.endHTable.set("G",100);
		this.endHTable.set("C",100);
	}
	,populateEndSTable: function() {
		this.endSTable.set("A",4.1);
		this.endSTable.set("T",4.1);
		this.endSTable.set("G",-2.8);
		this.endSTable.set("C",-2.8);
	}
	,getDeltaH: function(primerSeq) {
		var dnaSeq = primerSeq.getSequence();
		var seqLen = dnaSeq.length;
		var startNuc = dnaSeq.charAt(0);
		var endNuc = dnaSeq.charAt(seqLen - 1);
		var startH = this.endHTable.get(startNuc);
		var endH = this.endHTable.get(endNuc);
		var deltaH = startH + endH;
		var _g = 1;
		while(_g < seqLen) {
			var i = _g++;
			var currNuc = dnaSeq.charAt(i);
			var currH = this.deltaHTable.get(startNuc + currNuc);
			startNuc = currNuc;
			deltaH = deltaH + currH;
		}
		return deltaH;
	}
	,getDeltaS: function(primerSeq) {
		var dnaSeq = primerSeq.getSequence();
		var seqLen = dnaSeq.length;
		var startNuc = dnaSeq.charAt(0);
		var endNuc = dnaSeq.charAt(seqLen - 1);
		var startS = this.endSTable.get(startNuc);
		var endS = this.endSTable.get(endNuc);
		var deltaS = startS + endS;
		var _g = 1;
		while(_g < seqLen) {
			var i = _g++;
			var currNuc = dnaSeq.charAt(i);
			var currS = this.deltaSTable.get(startNuc + currNuc);
			startNuc = currNuc;
			deltaS = deltaS + currS;
		}
		return deltaS;
	}
	,saltCorrection: function(primerSeq,saltConc) {
		var saltPenalty = 0.368;
		var dnaSeq = primerSeq.getSequence();
		var seqLen = dnaSeq.length;
		saltConc = saltConc / 1000.0;
		var lnSalt = Math.log(saltConc);
		var deltaS = this.getDeltaS(primerSeq);
		var saltCorrDeltaS = deltaS + saltPenalty * (seqLen - 1) * lnSalt;
		return saltCorrDeltaS;
	}
	,tmCalculation: function(primerSeq,saltConc,primerConc) {
		var deltaH = this.getDeltaH(primerSeq);
		var saltCorrDeltaS = this.saltCorrection(primerSeq,saltConc);
		var gasConst = 1.987;
		var lnPrimerConc = Math.log(primerConc / 1000000000 / 2);
		var tmKelvin = deltaH / (saltCorrDeltaS + gasConst * lnPrimerConc);
		var tmCelcius = tmKelvin - 273.15;
		if(tmCelcius > 75) return 75; else return tmCelcius;
	}
	,__class__: saturn.core.TmCalc
};
saturn.core.User = $hxClasses["saturn.core.User"] = function() {
};
saturn.core.User.__name__ = ["saturn","core","User"];
saturn.core.User.prototype = {
	id: null
	,username: null
	,password: null
	,firstname: null
	,lastname: null
	,email: null
	,fullname: null
	,uuid: null
	,token: null
	,projects: null
	,__class__: saturn.core.User
};
saturn.core.Util = $hxClasses["saturn.core.Util"] = function() {
};
saturn.core.Util.__name__ = ["saturn","core","Util"];
saturn.core.Util.debug = function(msg) {
	saturn.app.SaturnServer.getDefaultServer().debug(msg);
};
saturn.core.Util.inspect = function(obj) {
	js.Node.console.log(obj);
};
saturn.core.Util.print = function(msg) {
	js.Node.console.log(msg);
};
saturn.core.Util.openw = function(path) {
	return saturn.core.Util.fs.createWriteStream(path);
};
saturn.core.Util.opentemp = function(prefix,cb) {
	saturn.core.Util.temp.open(prefix,function(error,info) {
		cb(error,new saturn.core.Stream(info.fd),info.path);
	});
};
saturn.core.Util.isHostEnvironmentAvailable = function() {
	return false;
};
saturn.core.Util.exec = function(program,args,cb) {
	var proc = js.Node.require("child_process").spawn(program,args);
	proc.stderr.on("data",function(error) {
		saturn.core.Util.debug(error.toString("utf8"));
	});
	proc.stdout.on("data",function(msg) {
		saturn.core.Util.debug(msg.toString("utf8"));
	});
	proc.on("close",function(code) {
		cb(code);
	});
};
saturn.core.Util.getNewExternalProcess = function(cb) {
};
saturn.core.Util.getNewFileDialog = function(cb) {
};
saturn.core.Util.saveFileAsDialog = function(contents,cb) {
};
saturn.core.Util.saveFile = function(fileName,contents,cb) {
};
saturn.core.Util.jsImports = function(paths,cb) {
	var errs = new haxe.ds.StringMap();
	var next = null;
	next = function() {
		if(paths.length == 0) cb(errs); else {
			var path = paths.pop();
			saturn.core.Util.jsImport(path,function(err) {
				if(__map_reserved[path] != null) errs.setReserved(path,err); else errs.h[path] = err;
				next();
			});
		}
	};
	next();
};
saturn.core.Util.jsImport = function(path,cb) {
};
saturn.core.Util.openFileAsDialog = function(cb) {
};
saturn.core.Util.readFile = function(fileName,cb) {
};
saturn.core.Util.open = function(path,cb) {
	saturn.core.Util.fs.createReadStream(path).pipe(saturn.core.Util.split()).on("data",function(line) {
		cb(null,line);
	}).on("error",function(err) {
		cb(err,null);
	}).on("end",function() {
		cb(null,null);
	});
};
saturn.core.Util.getProvider = function() {
	return saturn.client.core.CommonCore.getDefaultProvider();
};
saturn.core.Util.string = function(a) {
	return Std.string(a);
};
saturn.core.Util.clone = function(obj) {
	var ser = haxe.Serializer.run(obj);
	return haxe.Unserializer.run(ser);
};
saturn.core.Util.prototype = {
	__class__: saturn.core.Util
};
saturn.core.Stream = $hxClasses["saturn.core.Stream"] = function(streamId) {
	this.streamId = streamId;
};
saturn.core.Stream.__name__ = ["saturn","core","Stream"];
saturn.core.Stream.prototype = {
	streamId: null
	,write: function(content) {
		saturn.core.Util.fs.write(this.streamId,content);
	}
	,end: function(cb) {
		saturn.core.Util.fs.close(this.streamId,cb);
	}
	,__class__: saturn.core.Stream
};
if(!saturn.core.domain) saturn.core.domain = {};
saturn.core.domain.ABITrace = $hxClasses["saturn.core.domain.ABITrace"] = function() {
	this.setup();
};
saturn.core.domain.ABITrace.__name__ = ["saturn","core","domain","ABITrace"];
saturn.core.domain.ABITrace.prototype = {
	id: null
	,name: null
	,CH1: null
	,CH2: null
	,CH3: null
	,CH4: null
	,LABELS: null
	,SEQ: null
	,ALN_LABELS: null
	,ANNOTATIONS: null
	,alignment: null
	,traceDataJson: null
	,setup: function() {
		this.CH1 = [];
		this.CH2 = [];
		this.CH3 = [];
		this.CH4 = [];
		this.LABELS = [];
		this.SEQ = [];
		this.ALN_LABELS = [];
		this.ANNOTATIONS = [];
		this.alignment = null;
		if(this.traceDataJson != null) this.setData(JSON.parse(this.traceDataJson));
	}
	,isEmpty: function() {
		return this.CH1.length == 0 && this.CH2.length == 0 && this.CH3.length == 0 && this.CH4.length == 0;
	}
	,setData: function(traceData) {
		this.CH1 = traceData.CH1;
		this.CH2 = traceData.CH2;
		this.CH3 = traceData.CH3;
		this.CH4 = traceData.CH4;
		this.LABELS = traceData.LABELS;
		this.SEQ = traceData.SEQ;
		this.traceDataJson = haxe.Json.stringify(traceData,null,null);
	}
	,getSequence: function() {
		var strBuf_b = "";
		var _g = 0;
		var _g1 = this.SEQ;
		while(_g < _g1.length) {
			var $char = _g1[_g];
			++_g;
			if($char == null) strBuf_b += "null"; else strBuf_b += "" + $char;
		}
		return strBuf_b;
	}
	,trim: function(start,stop) {
		var trimmedTraceData = new saturn.core.domain.ABITrace();
		trimmedTraceData.CH1 = [];
		trimmedTraceData.CH2 = [];
		trimmedTraceData.CH3 = [];
		trimmedTraceData.CH4 = [];
		trimmedTraceData.LABELS = [];
		trimmedTraceData.SEQ = [];
		var _g = start;
		while(_g < stop) {
			var i = _g++;
			trimmedTraceData.CH1.push(this.CH1[i]);
			trimmedTraceData.CH2.push(this.CH2[i]);
			trimmedTraceData.CH3.push(this.CH3[i]);
			trimmedTraceData.CH4.push(this.CH4[i]);
			trimmedTraceData.LABELS.push(this.LABELS[i]);
			if(trimmedTraceData.LABELS[i] != "") trimmedTraceData.SEQ.push(trimmedTraceData.LABELS[i]);
		}
		if(this.ALN_LABELS.length > 0) {
			var _g1 = start;
			while(_g1 < stop) {
				var i1 = _g1++;
				trimmedTraceData.ALN_LABELS.push(this.ALN_LABELS[i1]);
			}
		}
		return trimmedTraceData;
	}
	,align: function(aln,isForwards) {
		var alnStrs = aln.getAlignmentRegion();
		var template = alnStrs[0];
		var query = alnStrs[1];
		window.console.log(template);
		window.console.log(query);
		var newTrace = new saturn.core.domain.ABITrace();
		var seqPos = 0;
		var _g1 = 0;
		var _g = this.getReadingCount();
		while(_g1 < _g) {
			var i = _g1++;
			if(this.CH1[i] == -1) continue;
			var c = this.LABELS[i];
			if(c != "") while(true) {
				var alnChar = template.charAt(seqPos);
				if(alnChar == "-") {
					var _g2 = 0;
					while(_g2 < 2) {
						var j = _g2++;
						newTrace.CH1.push(-1);
						newTrace.CH2.push(-1);
						newTrace.CH3.push(-1);
						newTrace.CH4.push(-1);
						newTrace.LABELS.push("");
						newTrace.ALN_LABELS.push("");
					}
					newTrace.CH1.push(-1);
					newTrace.CH2.push(-1);
					newTrace.CH3.push(-1);
					newTrace.CH4.push(-1);
					newTrace.LABELS.push("-");
					newTrace.ALN_LABELS.push(query.charAt(seqPos));
					var _g21 = 0;
					while(_g21 < 2) {
						var j1 = _g21++;
						newTrace.CH1.push(-1);
						newTrace.CH2.push(-1);
						newTrace.CH3.push(-1);
						newTrace.CH4.push(-1);
						newTrace.LABELS.push("");
						newTrace.ALN_LABELS.push("");
					}
					seqPos++;
				} else {
					newTrace.ALN_LABELS.push(query.charAt(seqPos++));
					break;
				}
			} else newTrace.ALN_LABELS.push("");
			newTrace.CH1.push(this.CH1[i]);
			newTrace.CH2.push(this.CH2[i]);
			newTrace.CH3.push(this.CH3[i]);
			newTrace.CH4.push(this.CH4[i]);
			newTrace.LABELS.push(this.LABELS[i]);
			newTrace.SEQ.push(this.SEQ[i]);
		}
		newTrace.alignment = aln;
		return newTrace;
	}
	,getReadingCount: function() {
		return this.CH1.length;
	}
	,setName: function(name) {
		this.name = name;
	}
	,__class__: saturn.core.domain.ABITrace
};
saturn.core.domain.Alignment = $hxClasses["saturn.core.domain.Alignment"] = function() {
	this.emptyInit();
};
saturn.core.domain.Alignment.__name__ = ["saturn","core","domain","Alignment"];
saturn.core.domain.Alignment.prototype = {
	objectIds: null
	,alignmentURL: null
	,content: null
	,name: null
	,id: null
	,emptyInit: function() {
		this.objectIds = new haxe.ds.StringMap();
	}
	,addObject: function(objectId) {
		this.objectIds.set(objectId,true);
	}
	,removeObject: function(objectId) {
		this.objectIds.remove(objectId);
	}
	,getAlignmentObjectIds: function() {
		var newObjectIds = [];
		var $it0 = this.objectIds.keys();
		while( $it0.hasNext() ) {
			var objectId = $it0.next();
			newObjectIds.push(objectId);
		}
		return newObjectIds;
	}
	,setAlignmentObjectIds: function(newObjectIds) {
		this.objectIds = new haxe.ds.StringMap();
		var _g = 0;
		while(_g < newObjectIds.length) {
			var objectId = newObjectIds[_g];
			++_g;
			this.objectIds.set(objectId,true);
		}
	}
	,objectExists: function(objectId) {
		return this.objectIds.exists(objectId);
	}
	,setAlignmentURL: function(alignmentURL) {
		this.alignmentURL = alignmentURL;
		this.content = null;
	}
	,getAlignmentURL: function() {
		return this.alignmentURL;
	}
	,setAlignmentContent: function(content) {
		this.content = content;
	}
	,getAlignmentContent: function() {
		return this.content;
	}
	,setName: function(name) {
		this.name = name;
	}
	,__class__: saturn.core.domain.Alignment
};
saturn.core.domain.Compound = $hxClasses["saturn.core.domain.Compound"] = function() {
	this.datestamp = new Date(1,2,3,4,5,6);
};
saturn.core.domain.Compound.__name__ = ["saturn","core","domain","Compound"];
saturn.core.domain.Compound.appendMolImage = function(objs,structureField,outputField,format) {
	var _g = 0;
	while(_g < objs.length) {
		var row = objs[_g];
		++_g;
		var value = Reflect.field(row,structureField);
		if(value == "" || value == null) value = ""; else {
			var s = saturn.core.domain.Compound.getMolImage(value,format);
			value = s;
		}
		row[outputField] = value;
	}
};
saturn.core.domain.Compound.getMolImage = function(value,format) {
	if(!saturn.core.domain.Compound.molCache.exists(format)) {
		var value1 = new haxe.ds.StringMap();
		saturn.core.domain.Compound.molCache.set(format,value1);
	}
	if(!(function($this) {
		var $r;
		var this1 = saturn.core.domain.Compound.molCache.get(format);
		$r = this1.exists(value);
		return $r;
	}(this))) try {
		var rdkit = RDKit;
		var mol = null;
		if(format == "SDF") mol = rdkit.Molecule.MolBlockToMol(value); else mol = rdkit.Molecule.fromSmiles(value);
		mol.Kekulize();
		var s = mol.Drawing2D();
		s = saturn.core.domain.Compound.r.replace(s,"");
		s = saturn.core.domain.Compound.rw.replace(s,"width=\"100%\"");
		s = saturn.core.domain.Compound.rh.replace(s,"height=\"100%\" viewBox=\"0 0 300 300\"");
		var this2 = saturn.core.domain.Compound.molCache.get(format);
		this2.set(value,s);
	} catch( err ) {
		if (err instanceof js._Boot.HaxeError) err = err.val;
		var this3 = saturn.core.domain.Compound.molCache.get(format);
		this3.set(value,null);
	}
	var this4 = saturn.core.domain.Compound.molCache.get(format);
	return this4.get(value);
};
saturn.core.domain.Compound.clearMolCache = function() {
	var $it0 = saturn.core.domain.Compound.molCache.keys();
	while( $it0.hasNext() ) {
		var format = $it0.next();
		var $it1 = (function($this) {
			var $r;
			var this1 = saturn.core.domain.Compound.molCache.get(format);
			$r = this1.keys();
			return $r;
		}(this));
		while( $it1.hasNext() ) {
			var key = $it1.next();
			var this2 = saturn.core.domain.Compound.molCache.get(format);
			this2.remove(key);
		}
	}
};
saturn.core.domain.Compound.prototype = {
	id: null
	,compoundId: null
	,supplierId: null
	,shortCompoundId: null
	,sdf: null
	,supplier: null
	,description: null
	,concentration: null
	,location: null
	,solute: null
	,comments: null
	,mw: null
	,confidential: null
	,datestamp: null
	,person: null
	,inchi: null
	,smiles: null
	,substructureSearch: function(cb) {
	}
	,assaySearch: function(cb) {
	}
	,test: function(cb) {
	}
	,__class__: saturn.core.domain.Compound
};
saturn.core.domain.DataSource = $hxClasses["saturn.core.domain.DataSource"] = function() {
};
saturn.core.domain.DataSource.__name__ = ["saturn","core","domain","DataSource"];
saturn.core.domain.DataSource.getEntities = function(source,cb) {
	var p = saturn.core.Util.getProvider();
	p.getById(source,saturn.core.domain.DataSource,function(obj,err) {
		if(err != null) cb(err,null); else if(obj == null) cb("Data source not found " + source,null); else {
			saturn.core.Util.debug("Retreiving records for source " + source);
			p.getByValues([saturn.core.Util.string(obj.id)],saturn.core.domain.Entity,"dataSourceId",function(objs,error) {
				saturn.core.Util.debug("Entities retrieved for source " + source);
				if(error != null) cb("An error occurred retrieving data source " + source + " entities\n" + error,null); else cb(null,objs);
			});
		}
	});
};
saturn.core.domain.DataSource.getSource = function(source,insert,cb) {
	var p = saturn.core.Util.getProvider();
	p.getById(source,saturn.core.domain.DataSource,function(obj,err) {
		if(err != null) cb("An error occurred looking for source: " + source + "\n" + err,null); else if(obj == null) {
			if(insert) {
				var obj1 = new saturn.core.domain.DataSource();
				obj1.name = source;
				p.insert(source,function(err1) {
					if(err1 != null) cb("An error occurred inserting source: " + source + "\n" + err1,null); else p.getById(source,saturn.core.domain.DataSource,function(obj2,err2) {
						if(err2 != null) cb("An error occurred looking for source: " + source + "\n" + err2,null); else if(obj2 == null) cb("Inserted source " + source + " could not be found",null); else cb(null,obj2);
					});
				});
			} else cb(null,null);
		} else cb(null,obj);
	});
};
saturn.core.domain.DataSource.prototype = {
	id: null
	,name: null
	,__class__: saturn.core.domain.DataSource
};
saturn.core.domain.Entity = $hxClasses["saturn.core.domain.Entity"] = function() {
};
saturn.core.domain.Entity.__name__ = ["saturn","core","domain","Entity"];
saturn.core.domain.Entity.insertList = function(ids,source,cb) {
	var uqx = new haxe.ds.StringMap();
	var _g = 0;
	while(_g < ids.length) {
		var id = ids[_g];
		++_g;
		if(__map_reserved[id] != null) uqx.setReserved(id,id); else uqx.h[id] = id;
	}
	ids = [];
	var $it0 = uqx.keys();
	while( $it0.hasNext() ) {
		var id1 = $it0.next();
		ids.push(id1);
	}
	saturn.core.domain.DataSource.getSource(source,false,function(err,sourceObj) {
		if(err != null) cb(err,null); else if(sourceObj == null) cb("Unable to find source " + source,null); else {
			var objs = [];
			var _g1 = 0;
			while(_g1 < ids.length) {
				var id2 = ids[_g1];
				++_g1;
				var entity = new saturn.core.domain.Entity();
				entity.entityId = id2;
				entity.dataSourceId = sourceObj.id;
				objs.push(entity);
			}
			var p = saturn.core.Util.getProvider();
			p.insertObjects(objs,function(err1) {
				if(err1 != null) cb("An error occurred inserting entities\n" + err1,null); else p.getByIds(ids,saturn.core.domain.Entity,function(objs1,err2) {
					if(err2 != null) cb("An error occurred looking for inserted objects\n" + err2,null); else cb(null,objs1);
				});
			});
		}
	});
};
saturn.core.domain.Entity.getObjects = function(ids,cb) {
	var p = saturn.core.Util.getProvider();
	p.getByIds(ids,saturn.core.domain.Entity,function(objs,err) {
		if(err != null) cb(err,null); else cb(null,objs);
	});
};
saturn.core.domain.Entity.prototype = {
	id: null
	,entityId: null
	,dataSourceId: null
	,reactionId: null
	,entityTypeId: null
	,altName: null
	,description: null
	,source: null
	,reaction: null
	,entityType: null
	,__class__: saturn.core.domain.Entity
};
saturn.core.domain.FileProxy = $hxClasses["saturn.core.domain.FileProxy"] = function() {
};
saturn.core.domain.FileProxy.__name__ = ["saturn","core","domain","FileProxy"];
saturn.core.domain.FileProxy.prototype = {
	path: null
	,content: null
	,__class__: saturn.core.domain.FileProxy
};
saturn.core.domain.Molecule = $hxClasses["saturn.core.domain.Molecule"] = function() {
};
saturn.core.domain.Molecule.__name__ = ["saturn","core","domain","Molecule"];
saturn.core.domain.Molecule.prototype = {
	id: null
	,name: null
	,sequence: null
	,entityId: null
	,entity: null
	,__class__: saturn.core.domain.Molecule
};
saturn.core.domain.MoleculeAnnotation = $hxClasses["saturn.core.domain.MoleculeAnnotation"] = function() {
};
saturn.core.domain.MoleculeAnnotation.__name__ = ["saturn","core","domain","MoleculeAnnotation"];
saturn.core.domain.MoleculeAnnotation.prototype = {
	id: null
	,entityId: null
	,labelId: null
	,start: null
	,stop: null
	,evalue: null
	,altevalue: null
	,entity: null
	,referent: null
	,__class__: saturn.core.domain.MoleculeAnnotation
};
saturn.core.domain.Uploader = $hxClasses["saturn.core.domain.Uploader"] = function(source,evalue) {
	this.initialised = false;
	this.source = source;
	this.cutoff = evalue;
};
saturn.core.domain.Uploader.__name__ = ["saturn","core","domain","Uploader"];
saturn.core.domain.Uploader.prototype = {
	referentMap: null
	,provider: null
	,generator: null
	,initialised: null
	,source: null
	,cutoff: null
	,next: function(items,generator) {
		var _g = this;
		this.generator = generator;
		if(this.initialised == false) {
			this.provider = saturn.core.Util.getProvider();
			this.setupReferentMap(function(err) {
				if(err != null) generator.die(err); else {
					_g.initialised = true;
					_g.next(items,generator);
				}
			});
		} else {
			if(items.length == 0) return;
			var ids = saturn.db.Model.generateUniqueListWithField(items,"entity.entityId");
			var acList = saturn.db.Model.generateUniqueListWithField(items,"referent.entityId");
			var newReferents = [];
			var _g1 = 0;
			while(_g1 < acList.length) {
				var id = acList[_g1];
				++_g1;
				if(!this.referentMap.exists(id)) newReferents.push(id);
			}
			var _g2 = 0;
			while(_g2 < items.length) {
				var item = items[_g2];
				++_g2;
				if(item.evalue > this.cutoff) HxOverrides.remove(items,item);
			}
			this.insertReferents(newReferents,function(err1) {
				if(err1 != null) generator.die(err1); else _g.provider.insertObjects(items,function(err2) {
					if(err2 != null) generator.die(err2); else generator.next();
				});
			});
		}
	}
	,setupReferentMap: function(cb) {
		var _g = this;
		saturn.core.domain.DataSource.getEntities(this.source,function(err,objs) {
			if(err != null) cb(err); else {
				_g.referentMap = saturn.db.Model.generateIDMap(objs);
				cb(null);
			}
		});
	}
	,insertReferents: function(accessions,cb) {
		var _g1 = this;
		if(accessions.length == 0) cb(null); else saturn.core.domain.Entity.insertList(accessions,this.source,function(err,objs) {
			if(err == null) {
				var _g = 0;
				while(_g < objs.length) {
					var obj = objs[_g];
					++_g;
					_g1.referentMap.set(obj.entityId,obj.id);
				}
			}
			cb(err);
		});
	}
	,__class__: saturn.core.domain.Uploader
};
saturn.core.domain.SaturnSession = $hxClasses["saturn.core.domain.SaturnSession"] = function() {
};
saturn.core.domain.SaturnSession.__name__ = ["saturn","core","domain","SaturnSession"];
saturn.core.domain.SaturnSession.prototype = {
	id: null
	,userName: null
	,isPublic: null
	,sessionContent: null
	,sessionName: null
	,user: null
	,load: function(cb) {
	}
	,getShortDescription: function() {
		if(this.user != null) return this.user.fullname + " - " + this.sessionName.split("-")[1]; else return this.sessionName;
	}
	,__class__: saturn.core.domain.SaturnSession
};
saturn.core.domain.SgcAllele = $hxClasses["saturn.core.domain.SgcAllele"] = function() {
	saturn.core.DNA.call(this,null);
	this.setup();
};
saturn.core.domain.SgcAllele.__name__ = ["saturn","core","domain","SgcAllele"];
saturn.core.domain.SgcAllele.__super__ = saturn.core.DNA;
saturn.core.domain.SgcAllele.prototype = $extend(saturn.core.DNA.prototype,{
	alleleId: null
	,id: null
	,entryCloneId: null
	,forwardPrimerId: null
	,reversePrimerId: null
	,dnaSeq: null
	,proteinSeq: null
	,plateWell: null
	,plate: null
	,entryClone: null
	,elnId: null
	,alleleStatus: null
	,forwardPrimer: null
	,reversePrimer: null
	,proteinSequenceObj: null
	,setup: function() {
		this.setSequence(this.dnaSeq);
		this.sequenceField = "dnaSeq";
		if(this.proteinSequenceObj == null) this.proteinSequenceObj = new saturn.core.Protein(null);
		this.addProtein("Translation",this.proteinSequenceObj);
	}
	,getMoleculeName: function() {
		return this.alleleId;
	}
	,loadProtein: function(cb) {
		this.proteinSequenceObj.setName(this.alleleId + " (Protein)");
		this.proteinSequenceObj.setDNA(this);
		cb(this.proteinSequenceObj);
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSeq = sequence;
	}
	,__class__: saturn.core.domain.SgcAllele
});
saturn.core.domain.SgcAllelePlate = $hxClasses["saturn.core.domain.SgcAllelePlate"] = function() {
};
saturn.core.domain.SgcAllelePlate.__name__ = ["saturn","core","domain","SgcAllelePlate"];
saturn.core.domain.SgcAllelePlate.prototype = {
	plateName: null
	,id: null
	,elnRef: null
	,setup: function() {
	}
	,loadPlate: function(cb) {
	}
	,__class__: saturn.core.domain.SgcAllelePlate
};
saturn.core.domain.SgcClone = $hxClasses["saturn.core.domain.SgcClone"] = function() {
};
saturn.core.domain.SgcClone.__name__ = ["saturn","core","domain","SgcClone"];
saturn.core.domain.SgcClone.prototype = {
	id: null
	,cloneId: null
	,constructId: null
	,construct: null
	,elnId: null
	,comments: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcClone
};
saturn.core.domain.SgcConstruct = $hxClasses["saturn.core.domain.SgcConstruct"] = function() {
	saturn.core.DNA.call(this,null);
	this.setup();
};
saturn.core.domain.SgcConstruct.__name__ = ["saturn","core","domain","SgcConstruct"];
saturn.core.domain.SgcConstruct.getNewMenuText = function() {
	return "Construct";
};
saturn.core.domain.SgcConstruct.__super__ = saturn.core.DNA;
saturn.core.domain.SgcConstruct.prototype = $extend(saturn.core.DNA.prototype,{
	constructId: null
	,id: null
	,proteinSeq: null
	,proteinSeqNoTag: null
	,dnaSeq: null
	,docId: null
	,vectorId: null
	,alleleId: null
	,constructStart: null
	,constructStop: null
	,vector: null
	,person: null
	,status: null
	,allele: null
	,wellId: null
	,constructPlate: null
	,res1: null
	,res2: null
	,expectedMassNoTag: null
	,expectedMass: null
	,elnId: null
	,constructComments: null
	,proteinSequenceObj: null
	,proteinSequenceNoTagObj: null
	,setup: function() {
		this.setSequence(this.dnaSeq);
		this.sequenceField = "dnaSeq";
		if(this.proteinSequenceObj == null) this.proteinSequenceObj = new saturn.core.Protein(null);
		if(this.proteinSequenceNoTagObj == null) this.proteinSequenceNoTagObj = new saturn.core.Protein(null);
		this.addProtein("Translation",this.proteinSequenceObj);
		this.addProtein("Translation No Tag",this.proteinSequenceNoTagObj);
	}
	,getMoleculeName: function() {
		return this.constructId;
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSeq = sequence;
	}
	,loadProtein: function(cb) {
		this.proteinSequenceObj.setName(this.constructId + " (Protein)");
		this.proteinSequenceObj.setDNA(this);
		cb(this.proteinSequenceObj);
	}
	,loadProteinNoTag: function(cb) {
		this.proteinSequenceNoTagObj.setName(this.constructId + " (Protein No Tag)");
		cb(this.proteinSequenceNoTagObj);
	}
	,__class__: saturn.core.domain.SgcConstruct
});
saturn.core.domain.SgcConstructPlate = $hxClasses["saturn.core.domain.SgcConstructPlate"] = function() {
};
saturn.core.domain.SgcConstructPlate.__name__ = ["saturn","core","domain","SgcConstructPlate"];
saturn.core.domain.SgcConstructPlate.prototype = {
	plateName: null
	,id: null
	,elnRef: null
	,setup: function() {
	}
	,loadPlate: function(cb) {
	}
	,__class__: saturn.core.domain.SgcConstructPlate
};
saturn.core.domain.SgcConstructStatus = $hxClasses["saturn.core.domain.SgcConstructStatus"] = function() { };
saturn.core.domain.SgcConstructStatus.__name__ = ["saturn","core","domain","SgcConstructStatus"];
saturn.core.domain.SgcConstructStatus.prototype = {
	constructPkey: null
	,status: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcConstructStatus
};
saturn.core.domain.SgcDomain = $hxClasses["saturn.core.domain.SgcDomain"] = function() {
};
saturn.core.domain.SgcDomain.__name__ = ["saturn","core","domain","SgcDomain"];
saturn.core.domain.SgcDomain.prototype = {
	id: null
	,accession: null
	,start: null
	,stop: null
	,targetId: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcDomain
};
saturn.core.domain.SgcEntryClone = $hxClasses["saturn.core.domain.SgcEntryClone"] = function() {
	saturn.core.DNA.call(this,null);
	this.setup();
};
saturn.core.domain.SgcEntryClone.__name__ = ["saturn","core","domain","SgcEntryClone"];
saturn.core.domain.SgcEntryClone.__super__ = saturn.core.DNA;
saturn.core.domain.SgcEntryClone.prototype = $extend(saturn.core.DNA.prototype,{
	entryCloneId: null
	,id: null
	,dnaSeq: null
	,target: null
	,seqSource: null
	,sourceId: null
	,sequenceConfirmed: null
	,elnId: null
	,proteinSequenceObj: null
	,getMoleculeName: function() {
		return this.entryCloneId;
	}
	,setup: function() {
		this.setSequence(this.dnaSeq);
		if(this.dnaSeq != null && this.dnaSeq != "" && this.dnaSeq.length > 2) this.proteinSequenceObj = new saturn.core.Protein(this.getFrameTranslation(saturn.core.GeneticCodes.STANDARD,saturn.core.Frame.ONE)); else this.proteinSequenceObj = new saturn.core.Protein(null);
		this.proteinSequenceObj.setDNA(this);
		this.addProtein("Translation",this.proteinSequenceObj);
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSeq = sequence;
		if(this.proteinSequenceObj != null && this.dnaSeq != null && this.dnaSeq != "" && this.dnaSeq.length > 2) this.proteinSequenceObj.setSequence(this.getFrameTranslation(saturn.core.GeneticCodes.STANDARD,saturn.core.Frame.ONE));
	}
	,loadTranslation: function(cb) {
		this.proteinSequenceObj.setName(this.entryCloneId + " (Protein)");
		cb(this.proteinSequenceObj);
	}
	,__class__: saturn.core.domain.SgcEntryClone
});
saturn.core.domain.SgcExpression = $hxClasses["saturn.core.domain.SgcExpression"] = function() {
};
saturn.core.domain.SgcExpression.__name__ = ["saturn","core","domain","SgcExpression"];
saturn.core.domain.SgcExpression.prototype = {
	id: null
	,expressionId: null
	,cloneId: null
	,clone: null
	,elnId: null
	,comments: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcExpression
};
saturn.core.domain.SgcForwardPrimer = $hxClasses["saturn.core.domain.SgcForwardPrimer"] = function() {
	saturn.core.DNA.call(this,null);
};
saturn.core.domain.SgcForwardPrimer.__name__ = ["saturn","core","domain","SgcForwardPrimer"];
saturn.core.domain.SgcForwardPrimer.__super__ = saturn.core.DNA;
saturn.core.domain.SgcForwardPrimer.prototype = $extend(saturn.core.DNA.prototype,{
	primerId: null
	,id: null
	,dnaSequence: null
	,targetId: null
	,setup: function() {
		this.setSequence(this.dnaSequence);
	}
	,getMoleculeName: function() {
		return this.primerId;
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSequence = sequence;
	}
	,__class__: saturn.core.domain.SgcForwardPrimer
});
saturn.core.domain.SgcPurification = $hxClasses["saturn.core.domain.SgcPurification"] = function() {
};
saturn.core.domain.SgcPurification.__name__ = ["saturn","core","domain","SgcPurification"];
saturn.core.domain.SgcPurification.prototype = {
	id: null
	,purificationId: null
	,expressionId: null
	,expression: null
	,column: null
	,elnId: null
	,comments: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcPurification
};
saturn.core.domain.SgcRestrictionSite = $hxClasses["saturn.core.domain.SgcRestrictionSite"] = function() {
	saturn.core.DNA.call(this,null);
	this.allowStar = true;
};
saturn.core.domain.SgcRestrictionSite.__name__ = ["saturn","core","domain","SgcRestrictionSite"];
saturn.core.domain.SgcRestrictionSite.__super__ = saturn.core.DNA;
saturn.core.domain.SgcRestrictionSite.prototype = $extend(saturn.core.DNA.prototype,{
	enzymeName: null
	,cutSequence: null
	,id: null
	,setup: function() {
		this.setSequence(this.cutSequence);
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.cutSequence = sequence;
	}
	,getSequence: function() {
		return this.cutSequence;
	}
	,__class__: saturn.core.domain.SgcRestrictionSite
});
saturn.core.domain.SgcReversePrimer = $hxClasses["saturn.core.domain.SgcReversePrimer"] = function() {
	saturn.core.DNA.call(this,null);
};
saturn.core.domain.SgcReversePrimer.__name__ = ["saturn","core","domain","SgcReversePrimer"];
saturn.core.domain.SgcReversePrimer.__super__ = saturn.core.DNA;
saturn.core.domain.SgcReversePrimer.prototype = $extend(saturn.core.DNA.prototype,{
	primerId: null
	,id: null
	,dnaSequence: null
	,targetId: null
	,setup: function() {
		this.setSequence(this.dnaSequence);
	}
	,getMoleculeName: function() {
		return this.primerId;
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSequence = sequence;
	}
	,__class__: saturn.core.domain.SgcReversePrimer
});
saturn.core.domain.SgcSeqData = $hxClasses["saturn.core.domain.SgcSeqData"] = function() {
};
saturn.core.domain.SgcSeqData.__name__ = ["saturn","core","domain","SgcSeqData"];
saturn.core.domain.SgcSeqData.prototype = {
	id: null
	,type: null
	,sequence: null
	,version: null
	,targetId: null
	,target: null
	,crc: null
	,setup: function() {
		if(this.sequence != null) this.crc = haxe.crypto.Md5.encode(this.sequence); else this.crc = "";
	}
	,__class__: saturn.core.domain.SgcSeqData
};
saturn.core.domain.SgcTarget = $hxClasses["saturn.core.domain.SgcTarget"] = function() {
	saturn.core.DNA.call(this,null);
	this.setup();
};
saturn.core.domain.SgcTarget.__name__ = ["saturn","core","domain","SgcTarget"];
saturn.core.domain.SgcTarget.__super__ = saturn.core.DNA;
saturn.core.domain.SgcTarget.prototype = $extend(saturn.core.DNA.prototype,{
	targetId: null
	,id: null
	,gi: null
	,dnaSeq: null
	,proteinSeq: null
	,geneId: null
	,activeStatus: null
	,pi: null
	,comments: null
	,proteinSequenceObj: null
	,setup: function() {
		this.setSequence(this.dnaSeq);
		this.setName(this.targetId);
		this.sequenceField = "dnaSeq";
		if(this.proteinSequenceObj == null) this.proteinSequenceObj = new saturn.core.Protein(null);
		this.addProtein("Translation",this.proteinSequenceObj);
	}
	,proteinSequenceUpdated: function(sequence) {
		this.proteinSeq = sequence;
	}
	,setSequence: function(sequence) {
		saturn.core.DNA.prototype.setSequence.call(this,sequence);
		this.dnaSeq = sequence;
	}
	,loadWonka: function() {
	}
	,__class__: saturn.core.domain.SgcTarget
});
saturn.core.domain.SgcUtil = $hxClasses["saturn.core.domain.SgcUtil"] = function() {
};
saturn.core.domain.SgcUtil.__name__ = ["saturn","core","domain","SgcUtil"];
saturn.core.domain.SgcUtil.generateNextIDForClasses = function(provider,targets,clazzes,cb) {
	var classToIds = new haxe.ds.StringMap();
	var next = null;
	next = function() {
		var clazz = clazzes.pop();
		saturn.core.domain.SgcUtil.generateNextID(provider,targets,clazz,function(map,error) {
			if(error != null) cb(null,error); else {
				var key = Type.getClassName(clazz);
				if(__map_reserved[key] != null) classToIds.setReserved(key,map); else classToIds.h[key] = map;
				if(clazzes.length == 0) cb(classToIds,null); else next();
			}
		});
	};
	next();
};
saturn.core.domain.SgcUtil.generateNextID = function(provider,targets,clazz,cb) {
	var q = new saturn.db.query_lang.Query(provider);
	var s = q.getSelect();
	var model = provider.getModel(clazz);
	var idField = new saturn.db.query_lang.Field(clazz,model.getFirstKey());
	q.getSelect().add(idField.substr(0,idField.instr("-",1))["as"]("target"));
	q.getSelect().add(idField.substr(idField.instr("-",1).plus(2),idField.length())["as"]("ID"));
	var _g1 = 0;
	var _g = targets.length;
	while(_g1 < _g) {
		var i = _g1++;
		var target = targets[i];
		q.getWhere().add(idField.like(new saturn.db.query_lang.Value(target).concat("%")));
		if(i < targets.length - 1) q.getWhere().addToken(new saturn.db.query_lang.Or());
	}
	var q2 = new saturn.db.query_lang.Query(provider);
	q2.fetchRawResults();
	q2.getSelect().add(new saturn.db.query_lang.Field(null,"target","a")["as"]("targetName"));
	q2.getSelect().add(new saturn.db.query_lang.Trim(new saturn.db.query_lang.Max(new saturn.db.query_lang.Field(null,"ID","a")))["as"]("lastId"));
	q2.getFrom().add(q["as"]("a"));
	q2.getGroup().add(new saturn.db.query_lang.Field(null,"target","a"));
	q2.run(function(objs,err) {
		if(err != null) cb(null,err); else {
			var map = new haxe.ds.StringMap();
			var _g2 = 0;
			while(_g2 < objs.length) {
				var obj = objs[_g2];
				++_g2;
				var nextId = Std.parseInt(obj.lastId) + 1;
				if((function($this) {
					var $r;
					var f = nextId;
					$r = isNaN(f);
					return $r;
				}(this)) || nextId == null || nextId == "null") nextId = 0;
				obj.lastId = nextId;
				saturn.core.Util.debug(obj.targetName);
				var key = obj.targetName;
				var value = obj.lastId;
				if(__map_reserved[key] != null) map.setReserved(key,value); else map.h[key] = value;
			}
			var _g3 = 0;
			while(_g3 < targets.length) {
				var target1 = targets[_g3];
				++_g3;
				if(!(__map_reserved[target1] != null?map.existsReserved(target1):map.h.hasOwnProperty(target1))) {
					if(__map_reserved[target1] != null) map.setReserved(target1,1); else map.h[target1] = 1;
				}
			}
			cb(map,null);
		}
	});
};
saturn.core.domain.SgcUtil.prototype = {
	__class__: saturn.core.domain.SgcUtil
};
saturn.core.domain.SgcVector = $hxClasses["saturn.core.domain.SgcVector"] = function() {
	this.addStopCodon = "no";
	saturn.core.DNA.call(this,null);
};
saturn.core.domain.SgcVector.__name__ = ["saturn","core","domain","SgcVector"];
saturn.core.domain.SgcVector.__super__ = saturn.core.DNA;
saturn.core.domain.SgcVector.prototype = $extend(saturn.core.DNA.prototype,{
	vectorId: null
	,id: null
	,vectorComments: null
	,proteaseName: null
	,proteaseCutSequence: null
	,proteaseProduct: null
	,antibiotic: null
	,organism: null
	,res1Id: null
	,res2Id: null
	,res1: null
	,res2: null
	,addStopCodon: null
	,requiredForwardExtension: null
	,requiredReverseExtension: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.SgcVector
});
saturn.core.domain.StructureModel = $hxClasses["saturn.core.domain.StructureModel"] = function() {
	this.ribbonOn = true;
	this.wireOn = false;
};
saturn.core.domain.StructureModel.__name__ = ["saturn","core","domain","StructureModel"];
saturn.core.domain.StructureModel.prototype = {
	id: null
	,modelId: null
	,contents: null
	,pdb: null
	,pathToPdb: null
	,ribbonOn: null
	,wireOn: null
	,labelsOn: null
	,renderer: null
	,icbURL: null
	,getContent: function() {
		if(this.contents != null) return this.contents; else if(this.pdb != null) {
			var array = new Uint8Array(this.pdb.content);
			var stringjs = String;
			var contents = "";
			var _g1 = 0;
			var _g = array.length;
			while(_g1 < _g) {
				var i = _g1++;
				contents += String.fromCharCode(array[i]);
			}
			return contents;
		} else return null;
	}
	,__class__: saturn.core.domain.StructureModel
};
saturn.core.domain.TextFile = $hxClasses["saturn.core.domain.TextFile"] = function() {
	this.autoRun = false;
	this.setup();
};
saturn.core.domain.TextFile.__name__ = ["saturn","core","domain","TextFile"];
saturn.core.domain.TextFile.prototype = {
	id: null
	,name: null
	,autoRun: null
	,value: null
	,setup: function() {
	}
	,getName: function() {
		return this.name;
	}
	,setText: function(content) {
		this.value = content;
	}
	,__class__: saturn.core.domain.TextFile
};
saturn.core.domain.TiddlyWiki = $hxClasses["saturn.core.domain.TiddlyWiki"] = function() {
};
saturn.core.domain.TiddlyWiki.__name__ = ["saturn","core","domain","TiddlyWiki"];
saturn.core.domain.TiddlyWiki.prototype = {
	id: null
	,pageId: null
	,content: null
	,setup: function() {
	}
	,__class__: saturn.core.domain.TiddlyWiki
};
saturn.core.molecule.MoleculeFloatAttribute = $hxClasses["saturn.core.molecule.MoleculeFloatAttribute"] = { __ename__ : ["saturn","core","molecule","MoleculeFloatAttribute"], __constructs__ : ["MW","MW_CONDESATION"] };
saturn.core.molecule.MoleculeFloatAttribute.MW = ["MW",0];
saturn.core.molecule.MoleculeFloatAttribute.MW.toString = $estr;
saturn.core.molecule.MoleculeFloatAttribute.MW.__enum__ = saturn.core.molecule.MoleculeFloatAttribute;
saturn.core.molecule.MoleculeFloatAttribute.MW_CONDESATION = ["MW_CONDESATION",1];
saturn.core.molecule.MoleculeFloatAttribute.MW_CONDESATION.toString = $estr;
saturn.core.molecule.MoleculeFloatAttribute.MW_CONDESATION.__enum__ = saturn.core.molecule.MoleculeFloatAttribute;
saturn.core.molecule.MoleculeStringAttribute = $hxClasses["saturn.core.molecule.MoleculeStringAttribute"] = { __ename__ : ["saturn","core","molecule","MoleculeStringAttribute"], __constructs__ : ["NAME"] };
saturn.core.molecule.MoleculeStringAttribute.NAME = ["NAME",0];
saturn.core.molecule.MoleculeStringAttribute.NAME.toString = $estr;
saturn.core.molecule.MoleculeStringAttribute.NAME.__enum__ = saturn.core.molecule.MoleculeStringAttribute;
saturn.core.molecule.MoleculeAlignMode = $hxClasses["saturn.core.molecule.MoleculeAlignMode"] = { __ename__ : ["saturn","core","molecule","MoleculeAlignMode"], __constructs__ : ["REGEX","SIMPLE"] };
saturn.core.molecule.MoleculeAlignMode.REGEX = ["REGEX",0];
saturn.core.molecule.MoleculeAlignMode.REGEX.toString = $estr;
saturn.core.molecule.MoleculeAlignMode.REGEX.__enum__ = saturn.core.molecule.MoleculeAlignMode;
saturn.core.molecule.MoleculeAlignMode.SIMPLE = ["SIMPLE",1];
saturn.core.molecule.MoleculeAlignMode.SIMPLE.toString = $estr;
saturn.core.molecule.MoleculeAlignMode.SIMPLE.__enum__ = saturn.core.molecule.MoleculeAlignMode;
saturn.core.molecule.MoleculeConstants = $hxClasses["saturn.core.molecule.MoleculeConstants"] = function() { };
saturn.core.molecule.MoleculeConstants.__name__ = ["saturn","core","molecule","MoleculeConstants"];
saturn.core.molecule.MoleculeSets = $hxClasses["saturn.core.molecule.MoleculeSets"] = { __ename__ : ["saturn","core","molecule","MoleculeSets"], __constructs__ : ["STANDARD"] };
saturn.core.molecule.MoleculeSets.STANDARD = ["STANDARD",0];
saturn.core.molecule.MoleculeSets.STANDARD.toString = $estr;
saturn.core.molecule.MoleculeSets.STANDARD.__enum__ = saturn.core.molecule.MoleculeSets;
saturn.core.molecule.MoleculeSetRegistry = $hxClasses["saturn.core.molecule.MoleculeSetRegistry"] = function() {
	this.moleculeSets = new haxe.ds.StringMap();
	this.register(saturn.core.molecule.MoleculeSets.STANDARD,new saturn.core.StandardMoleculeSet());
};
saturn.core.molecule.MoleculeSetRegistry.__name__ = ["saturn","core","molecule","MoleculeSetRegistry"];
saturn.core.molecule.MoleculeSetRegistry.getStandardMoleculeSet = function() {
	return saturn.core.molecule.MoleculeSetRegistry.defaultRegistry.get(saturn.core.molecule.MoleculeSets.STANDARD);
};
saturn.core.molecule.MoleculeSetRegistry.prototype = {
	moleculeSets: null
	,register: function(setType,set) {
		this.registerSet(Std.string(setType),set);
	}
	,get: function(setType) {
		return this.getSet(Std.string(setType));
	}
	,registerSet: function(name,set) {
		this.moleculeSets.set(name,set);
	}
	,getSet: function(name) {
		return this.moleculeSets.get(name);
	}
	,__class__: saturn.core.molecule.MoleculeSetRegistry
};
if(!saturn.core.parsers) saturn.core.parsers = {};
saturn.core.parsers.BaseParser = $hxClasses["saturn.core.parsers.BaseParser"] = function(path,handler,done) {
	this.lineCount = 0;
	var _g = this;
	saturn.core.Generator.call(this,-1);
	this.doneCB = done;
	this.path = path;
	this.setMaxAtOnce(200);
	this.onEnd(done);
	this.onNext(function(objs,next,c) {
		handler(objs,_g);
	});
	if(path != null) this.read();
};
saturn.core.parsers.BaseParser.__name__ = ["saturn","core","parsers","BaseParser"];
saturn.core.parsers.BaseParser.__super__ = saturn.core.Generator;
saturn.core.parsers.BaseParser.prototype = $extend(saturn.core.Generator.prototype,{
	doneCB: null
	,path: null
	,content: null
	,lineCount: null
	,setContent: function(content) {
		this.content = content;
		this.read();
	}
	,read: function() {
		var _g = this;
		if(this.path != null) saturn.core.Util.open(this.path,function(err,line) {
			if(err != null) _g.die("Error reading file"); else {
				_g.lineCount++;
				if(line == null) {
					saturn.core.Util.debug("Lines read: " + _g.lineCount);
					_g.finished();
				} else {
					var obj = _g.parseLine(line);
					if(obj != null) _g.push(obj);
				}
			}
		}); else if(this.content != null) {
			var lines = this.content.split("\n");
			var _g1 = 0;
			while(_g1 < lines.length) {
				var line1 = lines[_g1];
				++_g1;
				var obj1 = this.parseLine(line1);
				if(obj1 != null) this.push(obj1);
			}
			this.finished();
		}
	}
	,parseLine: function(line) {
		return null;
	}
	,__class__: saturn.core.parsers.BaseParser
});
saturn.core.parsers.HmmerParser = $hxClasses["saturn.core.parsers.HmmerParser"] = function(path,handler,done) {
	this.colSep = new EReg("\\s+","g");
	saturn.core.parsers.BaseParser.call(this,path,handler,done);
};
saturn.core.parsers.HmmerParser.__name__ = ["saturn","core","parsers","HmmerParser"];
saturn.core.parsers.HmmerParser.__super__ = saturn.core.parsers.BaseParser;
saturn.core.parsers.HmmerParser.prototype = $extend(saturn.core.parsers.BaseParser.prototype,{
	colSep: null
	,parseLine: function(line) {
		if(line.indexOf("#") == 0 || line == "") return null; else {
			var cols = this.colSep.split(line);
			var queryName = cols[0];
			var domainDescr = cols[3];
			var domainName = cols[4];
			var start = cols[19];
			var stop = cols[20];
			var evalue = parseFloat(cols[6]);
			var cdevalue = parseFloat(cols[11]);
			var entity = new saturn.core.domain.Entity();
			entity.entityId = queryName;
			var referent = new saturn.core.domain.Entity();
			referent.entityId = domainName;
			referent.altName = domainDescr;
			var annotation = new saturn.core.domain.MoleculeAnnotation();
			annotation.entity = entity;
			annotation.referent = referent;
			annotation.start = Std.parseInt(start);
			annotation.stop = Std.parseInt(stop);
			annotation.evalue = cdevalue;
			annotation.altevalue = evalue;
			return annotation;
		}
	}
	,__class__: saturn.core.parsers.HmmerParser
});
if(!saturn.core.scarab) saturn.core.scarab = {};
saturn.core.scarab.LabPage = $hxClasses["saturn.core.scarab.LabPage"] = function() {
};
saturn.core.scarab.LabPage.__name__ = ["saturn","core","scarab","LabPage"];
saturn.core.scarab.LabPage.findAll = function(phrase,cb) {
	saturn.core.Util.getProvider().getByNamedQuery("SCARAB_ELN_QUERY",[phrase,phrase,phrase,phrase],saturn.core.scarab.LabPage,false,function(objs,err) {
		cb(objs,err);
	});
};
saturn.core.scarab.LabPage.prototype = {
	id: null
	,experimentNo: null
	,dateStarted: null
	,title: null
	,userId: null
	,elnDocumentId: null
	,minEditableItem: null
	,lastEdited: null
	,user: null
	,sharingAllowed: null
	,personalTemplate: null
	,globalTemplate: null
	,dateExperimentStarted: null
	,userObj: null
	,items: null
	,relatedLabPages: null
	,sharedTo: null
	,tags: null
	,getShortDescription: function() {
		return this.title + " (" + this.experimentNo + ")";
	}
	,__class__: saturn.core.scarab.LabPage
};
saturn.core.scarab.LabPageItem = $hxClasses["saturn.core.scarab.LabPageItem"] = function() {
};
saturn.core.scarab.LabPageItem.__name__ = ["saturn","core","scarab","LabPageItem"];
saturn.core.scarab.LabPageItem.prototype = {
	id: null
	,itemOrder: null
	,caption: null
	,elnSectionId: null
	,__class__: saturn.core.scarab.LabPageItem
};
saturn.core.scarab.LabPageAttachments = $hxClasses["saturn.core.scarab.LabPageAttachments"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPageAttachments.__name__ = ["saturn","core","scarab","LabPageAttachments"];
saturn.core.scarab.LabPageAttachments.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPageAttachments.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	modifiedInICMdb: null
	,__class__: saturn.core.scarab.LabPageAttachments
});
saturn.core.scarab.LabPageExcel = $hxClasses["saturn.core.scarab.LabPageExcel"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPageExcel.__name__ = ["saturn","core","scarab","LabPageExcel"];
saturn.core.scarab.LabPageExcel.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPageExcel.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	excel: null
	,filename: null
	,html: null
	,htmlFolder: null
	,__class__: saturn.core.scarab.LabPageExcel
});
saturn.core.scarab.LabPageFileRefs = $hxClasses["saturn.core.scarab.LabPageFileRefs"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPageFileRefs.__name__ = ["saturn","core","scarab","LabPageFileRefs"];
saturn.core.scarab.LabPageFileRefs.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPageFileRefs.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	__class__: saturn.core.scarab.LabPageFileRefs
});
saturn.core.scarab.LabPageImage = $hxClasses["saturn.core.scarab.LabPageImage"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPageImage.__name__ = ["saturn","core","scarab","LabPageImage"];
saturn.core.scarab.LabPageImage.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPageImage.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	content: null
	,imageEdit: null
	,imageAnnot: null
	,vectorized: null
	,elnProperties: null
	,annotTexts: null
	,wmf: null
	,__class__: saturn.core.scarab.LabPageImage
});
saturn.core.scarab.LabPagePdf = $hxClasses["saturn.core.scarab.LabPagePdf"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPagePdf.__name__ = ["saturn","core","scarab","LabPagePdf"];
saturn.core.scarab.LabPagePdf.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPagePdf.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	pdf: null
	,image: null
	,__class__: saturn.core.scarab.LabPagePdf
});
saturn.core.scarab.LabPageTag = $hxClasses["saturn.core.scarab.LabPageTag"] = function() {
};
saturn.core.scarab.LabPageTag.__name__ = ["saturn","core","scarab","LabPageTag"];
saturn.core.scarab.LabPageTag.prototype = {
	id: null
	,tagName: null
	,__class__: saturn.core.scarab.LabPageTag
};
saturn.core.scarab.LabPageText = $hxClasses["saturn.core.scarab.LabPageText"] = function() {
	saturn.core.scarab.LabPageItem.call(this);
};
saturn.core.scarab.LabPageText.__name__ = ["saturn","core","scarab","LabPageText"];
saturn.core.scarab.LabPageText.__super__ = saturn.core.scarab.LabPageItem;
saturn.core.scarab.LabPageText.prototype = $extend(saturn.core.scarab.LabPageItem.prototype,{
	content: null
	,__class__: saturn.core.scarab.LabPageText
});
saturn.core.scarab.LabPageUser = $hxClasses["saturn.core.scarab.LabPageUser"] = function() {
};
saturn.core.scarab.LabPageUser.__name__ = ["saturn","core","scarab","LabPageUser"];
saturn.core.scarab.LabPageUser.prototype = {
	id: null
	,fullName: null
	,__class__: saturn.core.scarab.LabPageUser
};
saturn.core.scarab.ScarabProject = $hxClasses["saturn.core.scarab.ScarabProject"] = function() {
};
saturn.core.scarab.ScarabProject.__name__ = ["saturn","core","scarab","ScarabProject"];
saturn.core.scarab.ScarabProject.prototype = {
	id: null
	,projectName: null
	,projectOwner: null
	,projectAdmins: null
	,projectPages: null
	,__class__: saturn.core.scarab.ScarabProject
};
if(!saturn.db) saturn.db = {};
saturn.db.BatchFetch = $hxClasses["saturn.db.BatchFetch"] = function(onError) {
	this.items = new haxe.ds.StringMap();
	this.fetchList = [];
	this.retrieved = new haxe.ds.StringMap();
	this.position = 0;
	this.onError = onError;
};
saturn.db.BatchFetch.__name__ = ["saturn","db","BatchFetch"];
saturn.db.BatchFetch.prototype = {
	fetchList: null
	,userOnError: null
	,userOnComplete: null
	,position: null
	,retrieved: null
	,onComplete: null
	,onError: null
	,provider: null
	,items: null
	,onFinish: function(cb) {
		this.onComplete = cb;
	}
	,getById: function(objectId,clazz,key,callBack) {
		var list = [];
		list.push(objectId);
		return this.getByIds(list,clazz,key,callBack);
	}
	,getByIds: function(objectIds,clazz,key,callBack) {
		var work = new haxe.ds.StringMap();
		if(__map_reserved.IDS != null) work.setReserved("IDS",objectIds); else work.h["IDS"] = objectIds;
		if(__map_reserved.CLASS != null) work.setReserved("CLASS",clazz); else work.h["CLASS"] = clazz;
		if(__map_reserved.TYPE != null) work.setReserved("TYPE","getByIds"); else work.h["TYPE"] = "getByIds";
		if(__map_reserved.KEY != null) work.setReserved("KEY",key); else work.h["KEY"] = key;
		var value = callBack;
		work.set("CALLBACK",value);
		this.fetchList.push(work);
		return this;
	}
	,getByValue: function(value,clazz,field,key,callBack) {
		var list = [];
		list.push(value);
		return this.getByValues(list,clazz,field,key,callBack);
	}
	,getByValues: function(values,clazz,field,key,callBack) {
		var work = new haxe.ds.StringMap();
		if(__map_reserved.VALUES != null) work.setReserved("VALUES",values); else work.h["VALUES"] = values;
		if(__map_reserved.CLASS != null) work.setReserved("CLASS",clazz); else work.h["CLASS"] = clazz;
		if(__map_reserved.FIELD != null) work.setReserved("FIELD",field); else work.h["FIELD"] = field;
		if(__map_reserved.TYPE != null) work.setReserved("TYPE","getByValues"); else work.h["TYPE"] = "getByValues";
		if(__map_reserved.KEY != null) work.setReserved("KEY",key); else work.h["KEY"] = key;
		var value = callBack;
		work.set("CALLBACK",value);
		this.fetchList.push(work);
		return this;
	}
	,getByPkey: function(objectId,clazz,key,callBack) {
		var list = [];
		list.push(objectId);
		return this.getByPkeys(list,clazz,key,callBack);
	}
	,getByPkeys: function(objectIds,clazz,key,callBack) {
		var work = new haxe.ds.StringMap();
		if(__map_reserved.IDS != null) work.setReserved("IDS",objectIds); else work.h["IDS"] = objectIds;
		if(__map_reserved.CLASS != null) work.setReserved("CLASS",clazz); else work.h["CLASS"] = clazz;
		if(__map_reserved.TYPE != null) work.setReserved("TYPE","getByPkeys"); else work.h["TYPE"] = "getByPkeys";
		if(__map_reserved.KEY != null) work.setReserved("KEY",key); else work.h["KEY"] = key;
		var value = callBack;
		work.set("CALLBACK",value);
		this.fetchList.push(work);
		return this;
	}
	,append: function(val,field,clazz,cb) {
		var key = Type.getClassName(clazz) + "." + field;
		if(!this.items.exists(key)) {
			var value = [];
			this.items.set(key,value);
		}
		this.items.get(key).push({ val : val, field : field, clazz : clazz, cb : cb});
	}
	,next: function() {
		this.execute();
	}
	,setProvider: function(provider) {
		this.provider = provider;
	}
	,execute: function(cb) {
		var _g = this;
		var provider = this.provider;
		if(provider == null) provider = saturn.client.core.CommonCore.getDefaultProvider();
		if(cb != null) this.onFinish(cb);
		var $it0 = this.items.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var units = this.items.get(key);
			var work1 = new haxe.ds.StringMap();
			if(__map_reserved.TYPE != null) work1.setReserved("TYPE","FETCHITEM"); else work1.h["TYPE"] = "FETCHITEM";
			work1.set("FIELD",units[0].field);
			work1.set("CLASS",units[0].clazz);
			if(__map_reserved.ITEMS != null) work1.setReserved("ITEMS",units); else work1.h["ITEMS"] = units;
			this.items.remove(key);
			this.fetchList.push(work1);
		}
		if(this.position == this.fetchList.length) {
			this.onComplete();
			return;
		}
		var work = this.fetchList[this.position];
		var type;
		type = __map_reserved.TYPE != null?work.getReserved("TYPE"):work.h["TYPE"];
		this.position++;
		if(type == "getByIds") provider.getByIds(__map_reserved.IDS != null?work.getReserved("IDS"):work.h["IDS"],__map_reserved.CLASS != null?work.getReserved("CLASS"):work.h["CLASS"],function(objs,exception) {
			if(exception != null || objs == null) _g.onError(objs,exception); else {
				var key1;
				key1 = __map_reserved.KEY != null?work.getReserved("KEY"):work.h["KEY"];
				_g.retrieved.set(key1,objs);
				var userCallBack;
				userCallBack = __map_reserved.CALLBACK != null?work.getReserved("CALLBACK"):work.h["CALLBACK"];
				if(userCallBack != null) userCallBack(objs,exception); else if(_g.position == _g.fetchList.length) _g.onComplete(); else _g.execute();
			}
		}); else if(type == "getByValues") provider.getByValues(__map_reserved.VALUES != null?work.getReserved("VALUES"):work.h["VALUES"],__map_reserved.CLASS != null?work.getReserved("CLASS"):work.h["CLASS"],__map_reserved.FIELD != null?work.getReserved("FIELD"):work.h["FIELD"],function(objs1,exception1) {
			if(exception1 != null || objs1 == null) _g.onError(objs1,exception1); else {
				var key2;
				key2 = __map_reserved.KEY != null?work.getReserved("KEY"):work.h["KEY"];
				_g.retrieved.set(key2,objs1);
				var userCallBack1;
				userCallBack1 = __map_reserved.CALLBACK != null?work.getReserved("CALLBACK"):work.h["CALLBACK"];
				if(userCallBack1 != null) userCallBack1(objs1,exception1); else if(_g.position == _g.fetchList.length) _g.onComplete(); else _g.execute();
			}
		}); else if(type == "getByPkeys") provider.getByPkeys(__map_reserved.IDS != null?work.getReserved("IDS"):work.h["IDS"],__map_reserved.CLASS != null?work.getReserved("CLASS"):work.h["CLASS"],function(obj,exception2) {
			if(exception2 != null || obj == null) _g.onError(obj,exception2); else {
				var key3;
				key3 = __map_reserved.KEY != null?work.getReserved("KEY"):work.h["KEY"];
				_g.retrieved.set(key3,obj);
				var userCallBack2;
				userCallBack2 = __map_reserved.CALLBACK != null?work.getReserved("CALLBACK"):work.h["CALLBACK"];
				if(userCallBack2 != null) userCallBack2(obj,exception2); else if(_g.position == _g.fetchList.length) _g.onComplete(); else _g.execute();
			}
		}); else if(type == "FETCHITEM") {
			var items;
			items = __map_reserved.ITEMS != null?work.getReserved("ITEMS"):work.h["ITEMS"];
			var itemMap = new haxe.ds.StringMap();
			var _g1 = 0;
			while(_g1 < items.length) {
				var item = items[_g1];
				++_g1;
				if(!itemMap.exists(item.val)) {
					var value = [];
					itemMap.set(item.val,value);
				}
				itemMap.get(item.val).push(item.cb);
			}
			var values = [];
			var $it1 = itemMap.keys();
			while( $it1.hasNext() ) {
				var key4 = $it1.next();
				values.push(key4);
			}
			var field;
			field = __map_reserved.FIELD != null?work.getReserved("FIELD"):work.h["FIELD"];
			provider.getByValues(values,__map_reserved.CLASS != null?work.getReserved("CLASS"):work.h["CLASS"],field,function(objs2,exception3) {
				if(exception3 != null || objs2 == null) _g.onError(objs2,exception3); else {
					var _g2 = 0;
					while(_g2 < objs2.length) {
						var obj1 = objs2[_g2];
						++_g2;
						var fieldValue = Reflect.field(obj1,field);
						if(__map_reserved[fieldValue] != null?itemMap.existsReserved(fieldValue):itemMap.h.hasOwnProperty(fieldValue)) {
							var _g11 = 0;
							var _g21;
							_g21 = __map_reserved[fieldValue] != null?itemMap.getReserved(fieldValue):itemMap.h[fieldValue];
							while(_g11 < _g21.length) {
								var cb1 = _g21[_g11];
								++_g11;
								cb1(obj1);
							}
						}
					}
					if(_g.position == _g.fetchList.length) _g.onComplete(); else _g.execute();
				}
			});
		}
	}
	,getObject: function(key) {
		return this.retrieved.get(key);
	}
	,__class__: saturn.db.BatchFetch
};
saturn.db.Connection = $hxClasses["saturn.db.Connection"] = function() { };
saturn.db.Connection.__name__ = ["saturn","db","Connection"];
saturn.db.Connection.prototype = {
	execute: null
	,close: null
	,commit: null
	,setAutoCommit: null
	,__class__: saturn.db.Connection
};
saturn.db.Provider = $hxClasses["saturn.db.Provider"] = function() { };
saturn.db.Provider.__name__ = ["saturn","db","Provider"];
saturn.db.Provider.prototype = {
	getById: null
	,getByIds: null
	,getByPkey: null
	,getByPkeys: null
	,getByIdStartsWith: null
	,update: null
	,insert: null
	,'delete': null
	,generateQualifiedName: null
	,updateObjects: null
	,insertObjects: null
	,insertOrUpdate: null
	,rollback: null
	,commit: null
	,isAttached: null
	,sql: null
	,getByNamedQuery: null
	,getObjectFromCache: null
	,activate: null
	,getModel: null
	,getObjectModel: null
	,save: null
	,modelToReal: null
	,attach: null
	,resetCache: null
	,evictNamedQuery: null
	,readModels: null
	,dataBinding: null
	,isDataBinding: null
	,setSelectClause: null
	,_update: null
	,_insert: null
	,_delete: null
	,getByValue: null
	,getByValues: null
	,getObjects: null
	,queryPath: null
	,getModels: null
	,getModelClasses: null
	,connectAsUser: null
	,setConnectAsUser: null
	,enableCache: null
	,generatedLinkedClone: null
	,setUser: null
	,getUser: null
	,closeConnection: null
	,_closeConnection: null
	,setAutoCommit: null
	,setName: null
	,getName: null
	,getConfig: null
	,evictObject: null
	,getByExample: null
	,query: null
	,getQuery: null
	,getProviderType: null
	,getModelByStringName: null
	,getConnection: null
	,uploadFile: null
	,__class__: saturn.db.Provider
};
saturn.db.DefaultProvider = $hxClasses["saturn.db.DefaultProvider"] = function(binding_map,config,autoClose) {
	this.user = null;
	this.namedQueryHookConfigs = new haxe.ds.StringMap();
	this.namedQueryHooks = new haxe.ds.StringMap();
	this.connectWithUserCreds = false;
	this.enableBinding = true;
	this.useCache = true;
	this.setPlatform();
	if(binding_map != null) this.setModels(binding_map);
	this.config = config;
	this.autoClose = autoClose;
	this.namedQueryHooks = new haxe.ds.StringMap();
	if(config != null && Object.prototype.hasOwnProperty.call(config,"named_query_hooks")) this.addHooks(Reflect.field(config,"named_query_hooks"));
	var $it0 = this.namedQueryHooks.keys();
	while( $it0.hasNext() ) {
		var hook = $it0.next();
		saturn.core.Util.debug("Installed hook: " + hook + "/" + Std.string(this.namedQueryHooks.get(hook)));
	}
};
saturn.db.DefaultProvider.__name__ = ["saturn","db","DefaultProvider"];
saturn.db.DefaultProvider.__interfaces__ = [saturn.db.Provider];
saturn.db.DefaultProvider.prototype = {
	theBindingMap: null
	,fieldIndexMap: null
	,objectCache: null
	,namedQueryCache: null
	,useCache: null
	,enableBinding: null
	,connectWithUserCreds: null
	,namedQueryHooks: null
	,namedQueryHookConfigs: null
	,modelClasses: null
	,user: null
	,autoClose: null
	,name: null
	,config: null
	,winConversions: null
	,linConversions: null
	,conversions: null
	,regexs: null
	,platform: null
	,setPlatform: function() {
	}
	,generateQualifiedName: function(schemaName,tableName) {
		return null;
	}
	,getConfig: function() {
		return this.config;
	}
	,setName: function(name) {
		this.name = name;
	}
	,getName: function() {
		return this.name;
	}
	,setUser: function(user) {
		this.user = user;
		this._closeConnection();
	}
	,getUser: function() {
		return this.user;
	}
	,closeConnection: function(connection) {
		if(this.autoClose) this._closeConnection();
	}
	,_closeConnection: function() {
	}
	,generatedLinkedClone: function() {
		var clazz = js.Boot.getClass(this);
		var provider = Type.createEmptyInstance(clazz);
		provider.theBindingMap = this.theBindingMap;
		provider.fieldIndexMap = this.fieldIndexMap;
		provider.namedQueryCache = this.namedQueryCache;
		provider.useCache = this.useCache;
		provider.enableBinding = this.enableBinding;
		provider.connectWithUserCreds = this.connectWithUserCreds;
		provider.namedQueryHooks = this.namedQueryHooks;
		provider.modelClasses = this.modelClasses;
		provider.platform = this.platform;
		provider.linConversions = this.linConversions;
		provider.winConversions = this.winConversions;
		provider.conversions = this.conversions;
		provider.regexs = this.regexs;
		return provider;
	}
	,enableCache: function(cached) {
		this.useCache = cached;
	}
	,connectAsUser: function() {
		return this.connectWithUserCreds;
	}
	,setConnectAsUser: function(asUser) {
		this.connectWithUserCreds = asUser;
	}
	,setModels: function(binding_map) {
		this.theBindingMap = binding_map;
		var $it0 = binding_map.keys();
		while( $it0.hasNext() ) {
			var clazz = $it0.next();
			if((function($this) {
				var $r;
				var this1;
				this1 = __map_reserved[clazz] != null?binding_map.getReserved(clazz):binding_map.h[clazz];
				$r = this1.exists("polymorphic");
				return $r;
			}(this))) {
				if(!(function($this) {
					var $r;
					var this2;
					this2 = __map_reserved[clazz] != null?binding_map.getReserved(clazz):binding_map.h[clazz];
					$r = this2.exists("fields.synthetic");
					return $r;
				}(this))) {
					var this3;
					this3 = __map_reserved[clazz] != null?binding_map.getReserved(clazz):binding_map.h[clazz];
					var value = new haxe.ds.StringMap();
					this3.set("fields.synthetic",value);
				}
				var d;
				var this4;
				this4 = __map_reserved[clazz] != null?binding_map.getReserved(clazz):binding_map.h[clazz];
				d = this4.get("fields.synthetic");
				d.set("polymorphic",(function($this) {
					var $r;
					var this5;
					this5 = __map_reserved[clazz] != null?binding_map.getReserved(clazz):binding_map.h[clazz];
					$r = this5.get("polymorphic");
					return $r;
				}(this)));
			}
		}
		this.initModelClasses();
		this.resetCache();
	}
	,readModels: function(cb) {
	}
	,postConfigureModels: function() {
		var $it0 = this.theBindingMap.keys();
		while( $it0.hasNext() ) {
			var class_name = $it0.next();
			var d = this.theBindingMap.get(class_name);
			var value = this.getName();
			d.set("provider_name",value);
		}
		if(this.isModel(saturn.core.domain.FileProxy)) {
			var this1 = this.getModel(saturn.core.domain.FileProxy).getOptions();
			this.winConversions = this1.get("windows_conversions");
			var this2 = this.getModel(saturn.core.domain.FileProxy).getOptions();
			this.linConversions = this2.get("linux_conversions");
			if(this.platform == "windows") {
				this.conversions = this.winConversions;
				var this3 = this.getModel(saturn.core.domain.FileProxy).getOptions();
				this.regexs = this3.get("windows_allowed_paths_regex");
			} else if(this.platform == "linux") {
				this.conversions = this.linConversions;
				var this4 = this.getModel(saturn.core.domain.FileProxy).getOptions();
				this.regexs = this4.get("linux_allowed_paths_regex");
			}
			if(this.regexs != null) {
				var $it1 = this.regexs.keys();
				while( $it1.hasNext() ) {
					var key = $it1.next();
					var s;
					s = js.Boot.__cast(this.regexs.get(key) , String);
					var value1 = new EReg(s,"");
					this.regexs.set(key,value1);
				}
			}
		}
	}
	,getModels: function() {
		return this.theBindingMap;
	}
	,resetCache: function() {
		this.objectCache = new haxe.ds.StringMap();
		var $it0 = this.theBindingMap.keys();
		while( $it0.hasNext() ) {
			var className = $it0.next();
			var this1 = this.theBindingMap.get(className);
			var value = new haxe.ds.StringMap();
			this1.set("statements",value);
			var value1 = new haxe.ds.StringMap();
			this.objectCache.set(className,value1);
			if((function($this) {
				var $r;
				var this2 = $this.theBindingMap.get(className);
				$r = this2.exists("indexes");
				return $r;
			}(this))) {
				var $it1 = (function($this) {
					var $r;
					var this3;
					{
						var this4 = $this.theBindingMap.get(className);
						this3 = this4.get("indexes");
					}
					$r = this3.keys();
					return $r;
				}(this));
				while( $it1.hasNext() ) {
					var field = $it1.next();
					var this5 = this.objectCache.get(className);
					var value2 = new haxe.ds.StringMap();
					this5.set(field,value2);
				}
			}
		}
		this.namedQueryCache = new haxe.ds.StringMap();
	}
	,getObjectFromCache: function(clazz,field,val) {
		var className = Type.getClassName(clazz);
		if(this.objectCache.exists(className)) {
			if((function($this) {
				var $r;
				var this1 = $this.objectCache.get(className);
				$r = this1.exists(field);
				return $r;
			}(this))) {
				if((function($this) {
					var $r;
					var this2;
					{
						var this3 = $this.objectCache.get(className);
						this2 = this3.get(field);
					}
					var key = val;
					$r = this2.exists(key);
					return $r;
				}(this))) {
					var this4;
					var this5 = this.objectCache.get(className);
					this4 = this5.get(field);
					var key1 = val;
					return this4.get(key1);
				} else return null;
			} else return null;
		} else return null;
	}
	,initialiseObjects: function(idsToFetch,toBind,prefetched,exception,callBack,clazz,bindField,cache,allowAutoBind) {
		if(allowAutoBind == null) allowAutoBind = true;
		if(idsToFetch.length > 0 && toBind == null || clazz == null || toBind != null && toBind.length > 0 && clazz != null && js.Boot.__instanceof(toBind[0],clazz)) callBack(toBind,exception); else {
			var model = this.getModel(clazz);
			if(model == null) {
				var boundObjs1 = [];
				var _g = 0;
				while(_g < toBind.length) {
					var item = toBind[_g];
					++_g;
					var obj = Type.createInstance(clazz,[]);
					var _g1 = 0;
					var _g2 = Type.getInstanceFields(clazz);
					while(_g1 < _g2.length) {
						var field = _g2[_g1];
						++_g1;
						if(Object.prototype.hasOwnProperty.call(item,field)) Reflect.setField(obj,field,Reflect.field(item,field));
					}
					boundObjs1.push(obj);
				}
				callBack(boundObjs1,exception);
				return;
			}
			var autoActivate = model.getAutoActivateLevel();
			var surpressSetup = false;
			if(autoActivate != -1 && this.enableBinding && allowAutoBind) surpressSetup = true;
			var boundObjs = [];
			if(toBind != null) {
				var _g3 = 0;
				while(_g3 < toBind.length) {
					var obj1 = toBind[_g3];
					++_g3;
					boundObjs.push(this.bindObject(obj1,clazz,cache,bindField,surpressSetup));
				}
			}
			if(autoActivate != -1 && this.enableBinding && allowAutoBind) this.activate(boundObjs,autoActivate,function(err) {
				if(err == null) {
					var _g4 = 0;
					while(_g4 < boundObjs.length) {
						var boundObj = boundObjs[_g4];
						++_g4;
						if(Reflect.isFunction(boundObj.setup)) boundObj.setup();
					}
					if(prefetched != null) {
						var _g5 = 0;
						while(_g5 < prefetched.length) {
							var obj2 = prefetched[_g5];
							++_g5;
							boundObjs.push(obj2);
						}
					}
					callBack(boundObjs,exception);
				} else callBack(null,err);
			}); else {
				if(prefetched != null) {
					var _g6 = 0;
					while(_g6 < prefetched.length) {
						var obj3 = prefetched[_g6];
						++_g6;
						boundObjs.push(obj3);
					}
				}
				callBack(boundObjs,exception);
			}
		}
	}
	,getById: function(id,clazz,callBack) {
		this.getByIds([id],clazz,function(objs,exception) {
			if(objs != null) callBack(objs[0],exception); else callBack(null,exception);
		});
	}
	,getByIds: function(ids,clazz,callBack) {
		var _g = this;
		var prefetched = null;
		var idsToFetch = null;
		if(this.useCache) {
			var model = this.getModel(clazz);
			if(model != null) {
				var firstKey = model.getFirstKey();
				prefetched = [];
				idsToFetch = [];
				var _g1 = 0;
				while(_g1 < ids.length) {
					var id = ids[_g1];
					++_g1;
					var cacheObject = this.getObjectFromCache(clazz,firstKey,id);
					if(cacheObject != null) prefetched.push(cacheObject); else idsToFetch.push(id);
				}
			} else idsToFetch = ids;
		} else idsToFetch = ids;
		if(idsToFetch.length > 0) this._getByIds(idsToFetch,clazz,function(toBind,exception) {
			_g.initialiseObjects(idsToFetch,toBind,prefetched,exception,callBack,clazz,null,true);
		}); else callBack(prefetched,null);
	}
	,_getByIds: function(ids,clazz,callBack) {
	}
	,getByExample: function(obj,cb) {
		var q = this.getQuery();
		q.addExample(obj);
		this.query(q,cb);
	}
	,query: function(query,cb) {
		var _g = this;
		this._query(query,function(objs,err) {
			if(_g.isDataBinding()) {
				if(err == null) {
					var clazzList = query.getSelectClassList();
					if(query.bindResults() && clazzList != null) {
						if(clazzList.length == 1) _g.initialiseObjects([],objs,[],err,cb,Type.resolveClass(clazzList[0]),null,true);
					} else cb(objs,err);
				} else cb(null,err);
			} else cb(objs,err);
		});
	}
	,_query: function(query,cb) {
	}
	,getByValue: function(value,clazz,field,callBack) {
		this.getByValues([value],clazz,field,function(objs,exception) {
			if(objs != null) callBack(objs[0],exception); else callBack(null,exception);
		});
	}
	,getByValues: function(ids,clazz,field,callBack) {
		var _g = this;
		var prefetched = null;
		var idsToFetch = null;
		if(this.useCache) {
			var model = this.getModel(clazz);
			if(model != null) {
				prefetched = [];
				idsToFetch = [];
				var _g1 = 0;
				while(_g1 < ids.length) {
					var id = ids[_g1];
					++_g1;
					var cacheObject = this.getObjectFromCache(clazz,field,id);
					if(cacheObject != null) {
						if((cacheObject instanceof Array) && cacheObject.__enum__ == null) {
							var objArray = cacheObject;
							var _g11 = 0;
							while(_g11 < objArray.length) {
								var obj = objArray[_g11];
								++_g11;
								prefetched.push(obj);
							}
						} else prefetched.push(cacheObject);
					} else idsToFetch.push(id);
				}
			} else idsToFetch = ids;
		} else idsToFetch = ids;
		if(idsToFetch.length > 0) this._getByValues(idsToFetch,clazz,field,function(toBind,exception) {
			_g.initialiseObjects(idsToFetch,toBind,prefetched,exception,callBack,clazz,field,true);
		}); else callBack(prefetched,null);
	}
	,_getByValues: function(values,clazz,field,callBack) {
	}
	,getObjects: function(clazz,callBack) {
		var _g = this;
		this._getObjects(clazz,function(toBind,exception) {
			if(exception != null) callBack(null,exception); else _g.initialiseObjects([],toBind,[],exception,callBack,clazz,null,true);
		});
	}
	,_getObjects: function(clazz,callBack) {
	}
	,getByPkey: function(id,clazz,callBack) {
		this.getByPkeys([id],clazz,function(objs,exception) {
			if(objs != null) callBack(objs[0],exception); else callBack(null,exception);
		});
	}
	,getByPkeys: function(ids,clazz,callBack) {
		var _g = this;
		var prefetched = null;
		var idsToFetch = null;
		if(this.useCache) {
			var model = this.getModel(clazz);
			if(model != null) {
				var priField = model.getPrimaryKey();
				prefetched = [];
				idsToFetch = [];
				var _g1 = 0;
				while(_g1 < ids.length) {
					var id = ids[_g1];
					++_g1;
					var cacheObject = this.getObjectFromCache(clazz,priField,id);
					if(cacheObject != null) prefetched.push(cacheObject); else idsToFetch.push(id);
				}
			} else idsToFetch = ids;
		} else idsToFetch = ids;
		if(idsToFetch.length > 0) this._getByPkeys(idsToFetch,clazz,function(toBind,exception) {
			_g.initialiseObjects(idsToFetch,toBind,prefetched,exception,callBack,clazz,null,true);
		}); else callBack(prefetched,null);
	}
	,_getByPkeys: function(ids,clazz,callBack) {
	}
	,getConnection: function(config,cb) {
	}
	,sql: function(sql,parameters,cb) {
		this.getByNamedQuery("saturn.db.provider.hooks.RawSQLHook:SQL",[sql,parameters],null,false,cb);
	}
	,getByNamedQuery: function(queryId,parameters,clazz,cache,callBack) {
		var _g = this;
		saturn.core.Util.debug("In getByNamedQuery");
		try {
			var isCached = false;
			if(cache && this.namedQueryCache.exists(queryId)) {
				var qResults = null;
				var queries = this.namedQueryCache.get(queryId);
				var _g1 = 0;
				while(_g1 < queries.length) {
					var query = queries[_g1];
					++_g1;
					saturn.core.Util.debug("Checking for existing results");
					var serialParamString = haxe.Serializer.run(parameters);
					if(query.queryParamSerial == serialParamString) {
						qResults = query.queryResults;
						break;
					}
				}
				if(qResults != null) {
					callBack(qResults,null);
					return;
				}
			} else {
				var value = [];
				this.namedQueryCache.set(queryId,value);
			}
			var privateCB = function(toBind,exception) {
				if(toBind == null) {
					if(isCached == false && _g.useCache && cache) {
						var namedQuery = new saturn.db.NamedQueryCache();
						namedQuery.queryName = queryId;
						namedQuery.queryParams = parameters;
						namedQuery.queryParamSerial = haxe.Serializer.run(parameters);
						namedQuery.queryResults = toBind;
						_g.namedQueryCache.get(queryId).push(namedQuery);
					}
					callBack(toBind,exception);
				} else _g.initialiseObjects([],toBind,[],exception,function(objs,err) {
					if(isCached == false && _g.useCache && cache) {
						var namedQuery1 = new saturn.db.NamedQueryCache();
						namedQuery1.queryName = queryId;
						namedQuery1.queryParams = parameters;
						namedQuery1.queryParamSerial = haxe.Serializer.run(parameters);
						namedQuery1.queryResults = objs;
						_g.namedQueryCache.get(queryId).push(namedQuery1);
					}
					callBack(objs,err);
				},clazz,null,cache);
			};
			if(queryId == "saturn.workflow") {
				var jobName = parameters[0];
				var config = parameters[1];
				saturn.core.Util.debug("Got workflow query " + jobName);
				saturn.core.Util.debug(Type.getClassName(config == null?null:js.Boot.getClass(config)));
				if(this.namedQueryHooks.exists(jobName)) this.namedQueryHooks.get(jobName)(config,function(object,error) {
					privateCB([object],object.getError());
				}); else {
					saturn.core.Util.debug("Unknown workflow query");
					this._getByNamedQuery(queryId,parameters,clazz,privateCB);
				}
			} else if(this.namedQueryHooks.exists(queryId)) {
				var config1 = null;
				if(this.namedQueryHookConfigs.exists(queryId)) config1 = this.namedQueryHookConfigs.get(queryId);
				saturn.core.Util.debug("Calling hook");
				this.namedQueryHooks.get(queryId)(queryId,parameters,clazz,privateCB,config1);
			} else this._getByNamedQuery(queryId,parameters,clazz,privateCB);
		} catch( ex ) {
			if (ex instanceof js._Boot.HaxeError) ex = ex.val;
			callBack(null,"An unexpected exception has occurred");
			saturn.core.Util.debug(ex);
		}
	}
	,addHooks: function(hooks) {
		var _g = 0;
		while(_g < hooks.length) {
			var hookdef = hooks[_g];
			++_g;
			var name = Reflect.field(hookdef,"name");
			var hook;
			if(Object.prototype.hasOwnProperty.call(hookdef,"func")) hook = Reflect.field(hookdef,"func"); else {
				var clazz = Reflect.field(hookdef,"class");
				var method = Reflect.field(hookdef,"method");
				hook = Reflect.field(Type.resolveClass(clazz),method);
			}
			this.namedQueryHooks.set(name,hook);
			var value = hookdef;
			this.namedQueryHookConfigs.set(name,value);
		}
	}
	,_getByNamedQuery: function(queryId,parameters,clazz,callBack) {
	}
	,getByIdStartsWith: function(id,field,clazz,limit,callBack) {
		var _g = this;
		var queryId = "__STARTSWITH_" + Type.getClassName(clazz);
		var parameters = [];
		parameters.push(field);
		parameters.push(id);
		var isCached = false;
		if(this.namedQueryCache.exists(queryId)) {
			var qResults = null;
			var queries = this.namedQueryCache.get(queryId);
			var _g1 = 0;
			while(_g1 < queries.length) {
				var query = queries[_g1];
				++_g1;
				var qParams = query.queryParams;
				if(qParams.length != parameters.length) continue; else {
					var matched = true;
					var _g2 = 0;
					var _g11 = qParams.length;
					while(_g2 < _g11) {
						var i = _g2++;
						if(qParams[i] != parameters[i]) matched = false;
					}
					if(matched) {
						qResults = query.queryResults;
						break;
					}
				}
			}
			if(qResults != null) {
				callBack(qResults,null);
				return;
			}
		} else {
			var value = [];
			this.namedQueryCache.set(queryId,value);
		}
		this._getByIdStartsWith(id,field,clazz,limit,function(toBind,exception) {
			if(toBind == null) callBack(toBind,exception); else _g.initialiseObjects([],toBind,[],exception,function(objs,err) {
				if(isCached == false && _g.useCache) {
					var namedQuery = new saturn.db.NamedQueryCache();
					namedQuery.queryName = queryId;
					namedQuery.queryParams = parameters;
					namedQuery.queryResults = objs;
					_g.namedQueryCache.get(queryId).push(namedQuery);
				}
				callBack(objs,err);
			},clazz,null,false,false);
		});
	}
	,_getByIdStartsWith: function(id,field,clazz,limit,callBack) {
	}
	,update: function(object,callBack) {
		this.synchronizeInternalLinks([object]);
		var className = Type.getClassName(Type.getClass(object));
		this.evictObject(object);
		var attributeMaps = [];
		attributeMaps.push(this.unbindObject(object));
		this._update(attributeMaps,className,callBack);
	}
	,insert: function(obj,cb) {
		var _g = this;
		this.synchronizeInternalLinks([obj]);
		var className = Type.getClassName(Type.getClass(obj));
		this.evictObject(obj);
		var attributeMaps = [];
		attributeMaps.push(this.unbindObject(obj));
		this._insert(attributeMaps,className,function(err) {
			if(err == null) _g.attach([obj],true,function(err1) {
				cb(err1);
			}); else cb(err);
		});
	}
	,'delete': function(obj,cb) {
		var _g = this;
		var className = Type.getClassName(Type.getClass(obj));
		var attributeMaps = [];
		attributeMaps.push(this.unbindObject(obj));
		this.evictObject(obj);
		this._delete(attributeMaps,className,function(err) {
			var model = _g.getModel(Type.getClass(obj));
			var field = model.getPrimaryKey();
			obj[field] = null;
			cb(err);
		});
	}
	,evictObject: function(object) {
		var clazz = Type.getClass(object);
		var className = Type.getClassName(clazz);
		if(this.objectCache.exists(className)) {
			var $it0 = (function($this) {
				var $r;
				var this1 = $this.objectCache.get(className);
				$r = this1.keys();
				return $r;
			}(this));
			while( $it0.hasNext() ) {
				var indexField = $it0.next();
				var val = Reflect.field(object,indexField);
				if(val != null && val != "") {
					if((function($this) {
						var $r;
						var this2;
						{
							var this3 = $this.objectCache.get(className);
							this2 = this3.get(indexField);
						}
						$r = this2.exists(val);
						return $r;
					}(this))) {
						var this4;
						var this5 = this.objectCache.get(className);
						this4 = this5.get(indexField);
						this4.remove(val);
					}
				}
			}
		}
	}
	,evictNamedQuery: function(queryId,parameters) {
		if(this.namedQueryCache.exists(queryId)) {
			var qResults = null;
			var queries = this.namedQueryCache.get(queryId);
			var _g = 0;
			while(_g < queries.length) {
				var query = queries[_g];
				++_g;
				var qParams = query.queryParams;
				if(qParams.length != parameters.length) continue; else {
					var matched = true;
					var _g2 = 0;
					var _g1 = qParams.length;
					while(_g2 < _g1) {
						var i = _g2++;
						if(qParams[i] != parameters[i]) matched = false;
					}
					if(matched) {
						HxOverrides.remove(queries,query);
						break;
					}
				}
			}
			if(queries.length > 0) this.namedQueryCache.remove(queryId); else this.namedQueryCache.set(queryId,queries);
		}
	}
	,updateObjects: function(objs,callBack) {
		this.synchronizeInternalLinks(objs);
		var className = Type.getClassName(Type.getClass(objs[0]));
		var attributeMaps = [];
		var _g = 0;
		while(_g < objs.length) {
			var object = objs[_g];
			++_g;
			this.evictObject(object);
			attributeMaps.push(this.unbindObject(object));
		}
		this._update(attributeMaps,className,callBack);
	}
	,insertObjects: function(objs,cb) {
		var _g1 = this;
		if(objs.length == 0) {
			cb(null);
			return;
		}
		this.synchronizeInternalLinks(objs);
		this.attach(objs,false,function(err) {
			if(err != null) cb(err); else {
				var className = Type.getClassName(Type.getClass(objs[0]));
				var attributeMaps = [];
				var _g = 0;
				while(_g < objs.length) {
					var object = objs[_g];
					++_g;
					_g1.evictObject(object);
					attributeMaps.push(_g1.unbindObject(object));
				}
				_g1._insert(attributeMaps,className,function(err1) {
					cb(err1);
				});
			}
		});
	}
	,rollback: function(callBack) {
		this._rollback(callBack);
	}
	,commit: function(callBack) {
		this._commit(callBack);
	}
	,_update: function(attributeMaps,className,callBack) {
	}
	,_insert: function(attributeMaps,className,callBack) {
	}
	,_delete: function(attributeMaps,className,callBack) {
	}
	,_rollback: function(callBack) {
	}
	,_commit: function(cb) {
		cb("Commit not supported");
	}
	,bindObject: function(attributeMap,clazz,cache,indexField,suspendSetup) {
		if(suspendSetup == null) suspendSetup = false;
		if(clazz == null) {
			var _g = 0;
			var _g1 = Reflect.fields(attributeMap);
			while(_g < _g1.length) {
				var key = _g1[_g];
				++_g;
				var val = Reflect.field(attributeMap,key);
				if(saturn.db.DefaultProvider.r_date.match(val)) Reflect.setField(attributeMap,key,new Date(Date.parse(val)));
			}
			return attributeMap;
		}
		if(this.enableBinding) {
			var className = Type.getClassName(clazz);
			var parts = className.split(".");
			var shortName = parts.pop();
			var packageName = parts.join(".");
			var obj = Type.createInstance(clazz,[]);
			if(this.theBindingMap.exists(className)) {
				var map;
				var this1 = this.theBindingMap.get(className);
				map = this1.get("fields");
				var indexes;
				var this2 = this.theBindingMap.get(className);
				indexes = this2.get("indexes");
				var atPriIndex = null;
				var $it0 = indexes.keys();
				while( $it0.hasNext() ) {
					var atIndexField = $it0.next();
					if((__map_reserved[atIndexField] != null?indexes.getReserved(atIndexField):indexes.h[atIndexField]) == 1) {
						atPriIndex = atIndexField;
						break;
					}
				}
				var colPriIndex = null;
				if(atPriIndex != null) colPriIndex = __map_reserved[atPriIndex] != null?map.getReserved(atPriIndex):map.h[atPriIndex];
				var priKeyValue = null;
				if(Reflect.hasField(attributeMap,colPriIndex)) priKeyValue = Reflect.field(attributeMap,colPriIndex); else if(Reflect.hasField(attributeMap,colPriIndex.toLowerCase())) priKeyValue = Reflect.field(attributeMap,colPriIndex.toLowerCase());
				var keys = [];
				var $it1 = map.keys();
				while( $it1.hasNext() ) {
					var key1 = $it1.next();
					keys.push(key1);
				}
				if(indexField != null && !(__map_reserved[indexField] != null?map.existsReserved(indexField):map.h.hasOwnProperty(indexField))) keys.push(indexField);
				var _g2 = 0;
				while(_g2 < keys.length) {
					var key2 = keys[_g2];
					++_g2;
					if(!(function($this) {
						var $r;
						var this3 = $this.objectCache.get(className);
						$r = this3.exists(key2);
						return $r;
					}(this))) {
						var this4 = this.objectCache.get(className);
						var value = new haxe.ds.StringMap();
						this4.set(key2,value);
					}
					var atKey;
					atKey = __map_reserved[key2] != null?map.getReserved(key2):map.h[key2];
					var val1 = null;
					if(Reflect.hasField(attributeMap,atKey)) val1 = Reflect.field(attributeMap,atKey); else if(Reflect.hasField(attributeMap,atKey.toLowerCase())) val1 = Reflect.field(attributeMap,atKey.toLowerCase());
					if(saturn.db.DefaultProvider.r_date.match(val1)) Reflect.setField(obj,key2,new Date(Date.parse(val))); else obj[key2] = val1;
					if(cache && indexes != null && ((__map_reserved[key2] != null?indexes.existsReserved(key2):indexes.h.hasOwnProperty(key2)) || key2 == indexField) && this.useCache) {
						if(priKeyValue != null) {
							if((function($this) {
								var $r;
								var this5;
								{
									var this6 = $this.objectCache.get(className);
									this5 = this6.get(key2);
								}
								$r = this5.exists(val1);
								return $r;
							}(this))) {
								var mappedObj;
								var this7;
								var this8 = this.objectCache.get(className);
								this7 = this8.get(key2);
								mappedObj = this7.get(val1);
								var toCheck = mappedObj;
								var isArray = (mappedObj instanceof Array) && mappedObj.__enum__ == null;
								if(!isArray) toCheck = [mappedObj];
								var match = false;
								var _g21 = 0;
								var _g11 = toCheck.length;
								while(_g21 < _g11) {
									var i = _g21++;
									var eObj = toCheck[i];
									var priValue = Reflect.field(eObj,atPriIndex);
									if(priValue == priKeyValue) {
										toCheck[i] = obj;
										match = true;
										break;
									}
								}
								if(match == false) toCheck.push(obj);
								if(toCheck.length == 1) {
									var this9;
									var this10 = this.objectCache.get(className);
									this9 = this10.get(key2);
									var value1 = toCheck[0];
									this9.set(val1,value1);
								} else {
									var this11;
									var this12 = this.objectCache.get(className);
									this11 = this12.get(key2);
									this11.set(val1,toCheck);
								}
								continue;
							}
						}
						var this13;
						var this14 = this.objectCache.get(className);
						this13 = this14.get(key2);
						this13.set(val1,obj);
					}
				}
			}
			if(!suspendSetup && Reflect.isFunction(obj.setup)) obj.setup();
			return obj;
		} else return attributeMap;
	}
	,unbindObject: function(object) {
		if(this.enableBinding) {
			var className = Type.getClassName(Type.getClass(object));
			var attributeMap = new haxe.ds.StringMap();
			if(this.theBindingMap.exists(className)) {
				var map;
				var this1 = this.theBindingMap.get(className);
				map = this1.get("fields");
				var $it0 = map.keys();
				while( $it0.hasNext() ) {
					var key = $it0.next();
					var val = Reflect.field(object,key);
					var key1;
					key1 = __map_reserved[key] != null?map.getReserved(key):map.h[key];
					if(__map_reserved[key1] != null) attributeMap.setReserved(key1,val); else attributeMap.h[key1] = val;
				}
				return attributeMap;
			} else return null;
		} else return object;
	}
	,activate: function(objects,depthLimit,callBack) {
		var _g = this;
		this._activate(objects,1,depthLimit,function(error) {
			if(error == null) _g.merge(objects);
			callBack(error);
		});
	}
	,_activate: function(objects,depth,depthLimit,callBack) {
		var _g1 = this;
		var objectsToFetch = 0;
		var batchQuery = new saturn.db.BatchFetch(function(obj,err) {
		});
		batchQuery.setProvider(this);
		var classToFetch = new haxe.ds.StringMap();
		var _g = 0;
		while(_g < objects.length) {
			var object = objects[_g];
			++_g;
			if(object == null || js.Boot.__instanceof(object,ArrayBuffer) || js.Boot.__instanceof(object,haxe.ds.StringMap)) continue;
			var clazz = Type.getClass(object);
			if(clazz == null) continue;
			var clazzName = Type.getClassName(clazz);
			if(this.theBindingMap.exists(clazzName)) {
				if((function($this) {
					var $r;
					var this1 = $this.theBindingMap.get(clazzName);
					$r = this1.exists("fields.synthetic");
					return $r;
				}(this))) {
					var synthFields;
					var this2 = this.theBindingMap.get(clazzName);
					synthFields = this2.get("fields.synthetic");
					var $it0 = synthFields.keys();
					while( $it0.hasNext() ) {
						var synthFieldName = $it0.next();
						var synthInfo;
						synthInfo = __map_reserved[synthFieldName] != null?synthFields.getReserved(synthFieldName):synthFields.h[synthFieldName];
						var fkField = synthInfo.get("fk_field");
						if(fkField == null) {
							Reflect.setField(object,synthFieldName,Type.createInstance(Type.resolveClass(synthInfo.get("class")),[Reflect.field(object,synthInfo.get("field"))]));
							continue;
						}
						var synthVal = Reflect.field(object,synthFieldName);
						if(synthVal != null) continue;
						var isPolymorphic = synthInfo.exists("selector_field");
						var synthClass;
						if(isPolymorphic) {
							var selectorField = synthInfo.get("selector_field");
							var objValue = Reflect.field(object,selectorField);
							if(synthInfo.get("selector_values").exists(objValue)) synthClass = synthInfo.get("selector_values").get(objValue); else continue;
							var selectorValue = synthInfo.get("selector_value");
							synthFieldName = "_MERGE";
						} else synthClass = synthInfo.get("class");
						var field = synthInfo.get("field");
						var val = Reflect.field(object,field);
						if(val == null || val == "" && !((val | 0) === val)) object[synthFieldName] = null; else {
							var cacheObj = this.getObjectFromCache(Type.resolveClass(synthClass),fkField,val);
							if(cacheObj == null) {
								objectsToFetch++;
								if(!(__map_reserved[synthClass] != null?classToFetch.existsReserved(synthClass):classToFetch.h.hasOwnProperty(synthClass))) {
									var value = new haxe.ds.StringMap();
									if(__map_reserved[synthClass] != null) classToFetch.setReserved(synthClass,value); else classToFetch.h[synthClass] = value;
								}
								if(!(function($this) {
									var $r;
									var this3;
									this3 = __map_reserved[synthClass] != null?classToFetch.getReserved(synthClass):classToFetch.h[synthClass];
									$r = this3.exists(fkField);
									return $r;
								}(this))) {
									var this4;
									this4 = __map_reserved[synthClass] != null?classToFetch.getReserved(synthClass):classToFetch.h[synthClass];
									var value1 = new haxe.ds.StringMap();
									this4.set(fkField,value1);
								}
								var this5;
								var this6;
								this6 = __map_reserved[synthClass] != null?classToFetch.getReserved(synthClass):classToFetch.h[synthClass];
								this5 = this6.get(fkField);
								this5.set(val,"");
							} else object[synthFieldName] = cacheObj;
						}
					}
				}
			}
		}
		var $it1 = classToFetch.keys();
		while( $it1.hasNext() ) {
			var synthClass1 = $it1.next();
			var $it2 = (function($this) {
				var $r;
				var this7;
				this7 = __map_reserved[synthClass1] != null?classToFetch.getReserved(synthClass1):classToFetch.h[synthClass1];
				$r = this7.keys();
				return $r;
			}(this));
			while( $it2.hasNext() ) {
				var fkField1 = $it2.next();
				var objList = [];
				var $it3 = (function($this) {
					var $r;
					var this8;
					{
						var this9;
						this9 = __map_reserved[synthClass1] != null?classToFetch.getReserved(synthClass1):classToFetch.h[synthClass1];
						this8 = this9.get(fkField1);
					}
					$r = this8.keys();
					return $r;
				}(this));
				while( $it3.hasNext() ) {
					var objId = $it3.next();
					objList.push(objId);
				}
				batchQuery.getByValues(objList,Type.resolveClass(synthClass1),fkField1,"__IGNORED__",null);
			}
		}
		batchQuery.onComplete = function() {
			var _g2 = 0;
			while(_g2 < objects.length) {
				var object1 = objects[_g2];
				++_g2;
				var clazz1 = Type.getClass(object1);
				if(object1 == null || js.Boot.__instanceof(object1,ArrayBuffer) || clazz1 == null) continue;
				var clazzName1 = Type.getClassName(clazz1);
				if(_g1.theBindingMap.exists(clazzName1)) {
					if((function($this) {
						var $r;
						var this10 = _g1.theBindingMap.get(clazzName1);
						$r = this10.exists("fields.synthetic");
						return $r;
					}(this))) {
						var synthFields1;
						var this11 = _g1.theBindingMap.get(clazzName1);
						synthFields1 = this11.get("fields.synthetic");
						var $it4 = synthFields1.keys();
						while( $it4.hasNext() ) {
							var synthFieldName1 = $it4.next();
							var synthVal1 = Reflect.field(object1,synthFieldName1);
							if(synthVal1 != null) continue;
							var synthInfo1;
							synthInfo1 = __map_reserved[synthFieldName1] != null?synthFields1.getReserved(synthFieldName1):synthFields1.h[synthFieldName1];
							var isPolymorphic1 = synthInfo1.exists("selector_field");
							var synthClass2;
							if(isPolymorphic1) {
								var selectorField1 = synthInfo1.get("selector_field");
								var objValue1 = Reflect.field(object1,selectorField1);
								if(synthInfo1.get("selector_values").exists(objValue1)) synthClass2 = synthInfo1.get("selector_values").get(objValue1); else continue;
								var selectorValue1 = synthInfo1.get("selector_value");
								synthFieldName1 = "_MERGE";
							} else synthClass2 = synthInfo1.get("class");
							var field1 = synthInfo1.get("field");
							var val1 = Reflect.field(object1,field1);
							if(val1 != null && val1 != "") {
								var fkField2 = synthInfo1.get("fk_field");
								if(synthInfo1.exists("selector_field")) synthFieldName1 = "_MERGE";
								var cacheObj1 = _g1.getObjectFromCache(Type.resolveClass(synthClass2),fkField2,val1);
								if(cacheObj1 != null) object1[synthFieldName1] = cacheObj1;
							}
						}
					}
				}
			}
			var newObjList = [];
			var _g3 = 0;
			while(_g3 < objects.length) {
				var object2 = objects[_g3];
				++_g3;
				var clazz2 = Type.getClass(object2);
				if(object2 == null || js.Boot.__instanceof(object2,ArrayBuffer) || clazz2 == null) continue;
				var model = _g1.getModel(clazz2);
				if(model != null) {
					var _g21 = 0;
					var _g31 = Reflect.fields(object2);
					while(_g21 < _g31.length) {
						var field2 = _g31[_g21];
						++_g21;
						var val2 = Reflect.field(object2,field2);
						if(!model.isSyntheticallyBound(field2) || val2 == null) continue;
						var objs = Reflect.field(object2,field2);
						if(!((objs instanceof Array) && objs.__enum__ == null)) objs = [objs];
						var _g4 = 0;
						while(_g4 < objs.length) {
							var newObject = objs[_g4];
							++_g4;
							newObjList.push(newObject);
						}
					}
				}
			}
			if(newObjList.length > 0 && depthLimit > depth) _g1._activate(newObjList,depth + 1,depthLimit,callBack); else callBack(null);
		};
		batchQuery.execute();
	}
	,merge: function(objects) {
		var toVisit = [];
		var _g1 = 0;
		var _g = objects.length;
		while(_g1 < _g) {
			var i = _g1++;
			toVisit.push({ 'parent' : objects, 'pos' : i, 'value' : objects[i]});
		}
		this._merge(toVisit);
	}
	,_merge: function(toVisit) {
		while(true) {
			if(toVisit.length == 0) break;
			var item = toVisit.pop();
			var original = Reflect.field(item,"value");
			if(Object.prototype.hasOwnProperty.call(original,"_MERGE")) {
				var obj = Reflect.field(original,"_MERGE");
				var _g = 0;
				var _g1 = Reflect.fields(original);
				while(_g < _g1.length) {
					var field = _g1[_g];
					++_g;
					if(field != "_MERGE") Reflect.setField(obj,field,Reflect.field(original,field));
				}
				var parent = Reflect.field(item,"parent");
				if(Object.prototype.hasOwnProperty.call(item,"pos")) parent[Reflect.field(item,"pos")] = obj; else Reflect.setField(parent,Reflect.field(item,"field"),obj);
				original = obj;
			}
			var model = this.getModel(original);
			if(model == null) continue;
			var _g2 = 0;
			var _g11 = model.getFields();
			while(_g2 < _g11.length) {
				var field1 = _g11[_g2];
				++_g2;
				var value = Reflect.field(original,field1);
				var isObject = false;
				isObject = Std["is"](value,Object);
				if(isObject) {
					if((value instanceof Array) && value.__enum__ == null) {
						var _g3 = 0;
						var _g21 = value.length;
						while(_g3 < _g21) {
							var i = _g3++;
							toVisit.push({ 'parent' : value, 'pos' : i, 'value' : value[i]});
						}
					} else toVisit.push({ 'parent' : original, 'value' : value, 'field' : field1});
				}
			}
		}
	}
	,getModel: function(clazz) {
		if(clazz == null) return null; else {
			var t = Type.getClass(clazz);
			var className = Type.getClassName(clazz);
			return this.getModelByStringName(className);
		}
	}
	,getObjectModel: function(object) {
		if(object == null) return null; else {
			var clazz = Type.getClass(object);
			return this.getModel(clazz);
		}
	}
	,save: function(object,cb,autoAttach) {
		if(autoAttach == null) autoAttach = false;
		this.insertOrUpdate([object],cb,autoAttach);
	}
	,initModelClasses: function() {
		this.modelClasses = [];
		var $it0 = this.theBindingMap.keys();
		while( $it0.hasNext() ) {
			var classStr = $it0.next();
			var clazz = Type.resolveClass(classStr);
			if(clazz != null) this.modelClasses.push(this.getModel(clazz));
		}
	}
	,getModelClasses: function() {
		return this.modelClasses;
	}
	,getModelByStringName: function(className) {
		if(this.theBindingMap.exists(className)) {
			if((function($this) {
				var $r;
				var this1 = $this.theBindingMap.get(className);
				$r = this1.exists("model");
				return $r;
			}(this))) return new saturn.db.Model(this.theBindingMap.get(className),className); else return new saturn.db.Model(this.theBindingMap.get(className),className);
		} else return null;
	}
	,isModel: function(clazz) {
		if(this.theBindingMap != null) {
			var key = Type.getClassName(clazz);
			return this.theBindingMap.exists(key);
		} else return false;
	}
	,setSelectClause: function(className,selClause) {
		if(this.theBindingMap.exists(className)) {
			var this1;
			var this2 = this.theBindingMap.get(className);
			this1 = this2.get("statements");
			this1.set("SELECT",selClause);
		}
	}
	,modelToReal: function(modelDef,models,cb) {
		var _g3 = this;
		var priKey = modelDef.getPrimaryKey();
		var fields = modelDef.getFields();
		var clazz = modelDef.getClass();
		var syntheticInstanceAttributes = modelDef.getSynthenticFields();
		var syntheticSet = null;
		if(syntheticInstanceAttributes != null) {
			syntheticSet = new haxe.ds.StringMap();
			var $it0 = syntheticInstanceAttributes.keys();
			while( $it0.hasNext() ) {
				var instanceName = $it0.next();
				var fkRel;
				fkRel = __map_reserved[instanceName] != null?syntheticInstanceAttributes.getReserved(instanceName):syntheticInstanceAttributes.h[instanceName];
				var parentIdColumn = fkRel.get("fk_field");
				var childIdColumn = fkRel.get("field");
				var value;
				var _g = new haxe.ds.StringMap();
				if(__map_reserved.childIdColumn != null) _g.setReserved("childIdColumn",childIdColumn); else _g.h["childIdColumn"] = childIdColumn;
				var value1 = fkRel.get("fk_field");
				_g.set("parentIdColumn",value1);
				var value2 = fkRel.get("class");
				_g.set("class",value2);
				value = _g;
				if(__map_reserved[instanceName] != null) syntheticSet.setReserved(instanceName,value); else syntheticSet.h[instanceName] = value;
			}
		}
		var clazzToFieldToIds = new haxe.ds.StringMap();
		var _g1 = 0;
		while(_g1 < models.length) {
			var model = models[_g1];
			++_g1;
			var _g11 = 0;
			var _g2 = modelDef.getFields();
			while(_g11 < _g2.length) {
				var field = _g2[_g11];
				++_g11;
				if(field.indexOf(".") > -1) {
					var parts = field.split(".");
					var instanceName1 = parts[0];
					if(syntheticSet != null && (__map_reserved[instanceName1] != null?syntheticSet.existsReserved(instanceName1):syntheticSet.h.hasOwnProperty(instanceName1))) {
						var lookupField = parts[parts.length - 1];
						var lookupClazz;
						var this1;
						this1 = __map_reserved[instanceName1] != null?syntheticSet.getReserved(instanceName1):syntheticSet.h[instanceName1];
						lookupClazz = this1.get("class");
						var val = Reflect.field(model,field);
						if(val == null || val == "" && !((val | 0) === val)) continue;
						var clazz1 = Type.resolveClass(lookupClazz);
						var cachedObject = this.getObjectFromCache(clazz1,lookupField,val);
						if(cachedObject == null) {
							if(!(function($this) {
								var $r;
								var key = lookupClazz;
								$r = __map_reserved[key] != null?clazzToFieldToIds.existsReserved(key):clazzToFieldToIds.h.hasOwnProperty(key);
								return $r;
							}(this))) {
								var key1 = lookupClazz;
								var value3 = new haxe.ds.StringMap();
								if(__map_reserved[key1] != null) clazzToFieldToIds.setReserved(key1,value3); else clazzToFieldToIds.h[key1] = value3;
							}
							if(!(function($this) {
								var $r;
								var this2;
								{
									var key2 = lookupClazz;
									this2 = __map_reserved[key2] != null?clazzToFieldToIds.getReserved(key2):clazzToFieldToIds.h[key2];
								}
								$r = this2.exists(lookupField);
								return $r;
							}(this))) {
								var this3;
								var key3 = lookupClazz;
								this3 = __map_reserved[key3] != null?clazzToFieldToIds.getReserved(key3):clazzToFieldToIds.h[key3];
								var value4 = new haxe.ds.StringMap();
								this3.set(lookupField,value4);
							}
							var this4;
							var this5;
							var key4 = lookupClazz;
							this5 = __map_reserved[key4] != null?clazzToFieldToIds.getReserved(key4):clazzToFieldToIds.h[key4];
							this4 = this5.get(lookupField);
							this4.set(val,"");
						}
					}
				}
			}
		}
		var batchFetch = new saturn.db.BatchFetch(function(obj,err) {
			cb(err,obj);
		});
		var $it1 = clazzToFieldToIds.keys();
		while( $it1.hasNext() ) {
			var clazzStr = $it1.next();
			var $it2 = (function($this) {
				var $r;
				var this6;
				this6 = __map_reserved[clazzStr] != null?clazzToFieldToIds.getReserved(clazzStr):clazzToFieldToIds.h[clazzStr];
				$r = this6.keys();
				return $r;
			}(this));
			while( $it2.hasNext() ) {
				var fieldStr = $it2.next();
				var valList = [];
				var $it3 = (function($this) {
					var $r;
					var this7;
					{
						var this8;
						this8 = __map_reserved[clazzStr] != null?clazzToFieldToIds.getReserved(clazzStr):clazzToFieldToIds.h[clazzStr];
						this7 = this8.get(fieldStr);
					}
					$r = this7.keys();
					return $r;
				}(this));
				while( $it3.hasNext() ) {
					var val1 = $it3.next();
					valList.push(val1);
				}
				batchFetch.getByIds(valList,Type.resolveClass(clazzStr),"__IGNORE__",null);
			}
		}
		batchFetch.onComplete = function(err1,objs) {
			if(err1 != null) cb(err1,null); else {
				var mappedModels = [];
				var _g4 = 0;
				while(_g4 < models.length) {
					var model1 = models[_g4];
					++_g4;
					var mappedModel = Type.createEmptyInstance(clazz);
					var _g12 = 0;
					var _g21 = modelDef.getFields();
					while(_g12 < _g21.length) {
						var field1 = _g21[_g12];
						++_g12;
						if(field1.indexOf(".") > -1) {
							var parts1 = field1.split(".");
							var instanceName2 = parts1[0];
							if(__map_reserved[instanceName2] != null?syntheticSet.existsReserved(instanceName2):syntheticSet.h.hasOwnProperty(instanceName2)) {
								var lookupField1 = parts1[parts1.length - 1];
								var lookupClazz1;
								var this9;
								this9 = __map_reserved[instanceName2] != null?syntheticSet.getReserved(instanceName2):syntheticSet.h[instanceName2];
								lookupClazz1 = this9.get("class");
								var val2 = Reflect.field(model1,field1);
								if(val2 == null || val2 == "") continue;
								var clazz2 = Type.resolveClass(lookupClazz1);
								var cachedObject1 = _g3.getObjectFromCache(clazz2,lookupField1,val2);
								if(cachedObject1 != null) {
									var idColumn;
									var this10;
									this10 = __map_reserved[instanceName2] != null?syntheticSet.getReserved(instanceName2):syntheticSet.h[instanceName2];
									idColumn = this10.get("parentIdColumn");
									var val3 = Reflect.field(cachedObject1,idColumn);
									if(val3 == null || val3 == "" && !((val3 | 0) === val3)) {
										cb("Unexpected mapping error",mappedModels);
										return;
									}
									var dstColumn;
									var this11;
									this11 = __map_reserved[instanceName2] != null?syntheticSet.getReserved(instanceName2):syntheticSet.h[instanceName2];
									dstColumn = this11.get("childIdColumn");
									Reflect.setField(mappedModel,dstColumn,val3);
								} else {
									cb("Unable to find " + val2,mappedModels);
									return;
								}
							}
						} else {
							var val4 = Reflect.field(model1,field1);
							mappedModel[field1] = val4;
						}
					}
					mappedModels.push(mappedModel);
				}
				cb(null,mappedModels);
			}
		};
		batchFetch.execute();
	}
	,dataBinding: function(enable) {
		this.enableBinding = enable;
	}
	,isDataBinding: function() {
		return this.enableBinding;
	}
	,queryPath: function(fromClazz,queryPath,fieldValue,functionName,cb) {
		var _g = this;
		var parts = queryPath.split(".");
		var fieldName = parts.pop();
		var synthField = parts.pop();
		var model = this.getModel(fromClazz);
		if(model.isSynthetic(synthField)) {
			var fieldDef;
			var this1 = model.getSynthenticFields();
			fieldDef = this1.get(synthField);
			var childClazz = Type.resolveClass(fieldDef.get("class"));
			Reflect.callMethod(this,Reflect.field(this,functionName),[[fieldValue],childClazz,fieldName,function(objs,err) {
				if(err == null) {
					var values = [];
					var _g1 = 0;
					while(_g1 < objs.length) {
						var obj = objs[_g1];
						++_g1;
						values.push(Reflect.field(obj,fieldDef.get("fk_field")));
					}
					var parentField = fieldDef.get("field");
					_g.getByValues(values,fromClazz,parentField,function(objs1,err1) {
						cb(err1,objs1);
					});
				} else cb(err,null);
			}]);
		}
	}
	,setAutoCommit: function(autoCommit,cb) {
		cb("Set auto commit mode ");
	}
	,attach: function(objs,refreshFields,cb) {
		var _g = this;
		var bf = new saturn.db.BatchFetch(function(obj,err) {
			cb(err);
		});
		bf.setProvider(this);
		this._attach(objs,refreshFields,bf);
		bf.onComplete = function() {
			_g.synchronizeInternalLinks(objs);
			cb(null);
		};
		bf.execute();
	}
	,synchronizeInternalLinks: function(objs) {
		if(!this.isDataBinding()) return;
		var _g = 0;
		while(_g < objs.length) {
			var obj = objs[_g];
			++_g;
			var clazz = Type.getClass(obj);
			var model = this.getModel(clazz);
			var synthFields = model.getSynthenticFields();
			if(synthFields != null) {
				var $it0 = synthFields.keys();
				while( $it0.hasNext() ) {
					var synthFieldName = $it0.next();
					var synthField;
					synthField = __map_reserved[synthFieldName] != null?synthFields.getReserved(synthFieldName):synthFields.h[synthFieldName];
					var synthObj = Reflect.field(obj,synthFieldName);
					var field = synthField.get("field");
					var fkField = synthField.get("fk_field");
					if(synthObj != null) {
						if(fkField == null) Reflect.setField(obj,field,synthObj.getValue()); else {
							Reflect.setField(obj,field,Reflect.field(synthObj,fkField));
							this.synchronizeInternalLinks([synthObj]);
						}
					}
				}
			}
		}
	}
	,_attach: function(objs,refreshFields,bf) {
		var _g = 0;
		while(_g < objs.length) {
			var obj = [objs[_g]];
			++_g;
			var clazz = Type.getClass(obj[0]);
			var model = this.getModel(clazz);
			var priField = [model.getPrimaryKey()];
			var secField = model.getFirstKey();
			if(Reflect.field(obj[0],priField[0]) == null || Reflect.field(obj[0],priField[0]) == "") {
				var fieldVal = Reflect.field(obj[0],secField);
				if(fieldVal != null) bf.append(fieldVal,secField,clazz,(function(priField,obj) {
					return function(dbObj) {
						if(refreshFields) {
							var _g1 = 0;
							var _g2 = Reflect.fields(dbObj);
							while(_g1 < _g2.length) {
								var field = _g2[_g1];
								++_g1;
								Reflect.setField(obj[0],field,Reflect.field(dbObj,field));
							}
						} else Reflect.setField(obj[0],priField[0],Reflect.field(dbObj,priField[0]));
					};
				})(priField,obj));
			}
			var synthFields = model.getSynthenticFields();
			if(synthFields != null) {
				var $it0 = synthFields.keys();
				while( $it0.hasNext() ) {
					var synthFieldName = $it0.next();
					var synthField;
					synthField = __map_reserved[synthFieldName] != null?synthFields.getReserved(synthFieldName):synthFields.h[synthFieldName];
					var synthObj = Reflect.field(obj[0],synthFieldName);
					if(synthObj != null) this._attach([synthObj],refreshFields,bf);
				}
			}
		}
	}
	,getQuery: function() {
		var query = new saturn.db.query_lang.Query(this);
		return query;
	}
	,getProviderType: function() {
		return "NONE";
	}
	,isAttached: function(obj) {
		var model = this.getModel(Type.getClass(obj));
		var priField = model.getPrimaryKey();
		var val = Reflect.field(obj,priField);
		if(val == null || val == "") return false; else return true;
	}
	,insertOrUpdate: function(objs,cb,autoAttach) {
		if(autoAttach == null) autoAttach = false;
		var _g1 = this;
		var run = function() {
			var insertList = [];
			var updateList = [];
			var _g = 0;
			while(_g < objs.length) {
				var obj = objs[_g];
				++_g;
				if(!_g1.isAttached(obj)) insertList.push(obj); else updateList.push(obj);
			}
			if(insertList.length > 0) _g1.insertObjects(insertList,function(err) {
				if(err == null && updateList.length > 0) _g1.updateObjects(updateList,cb); else cb(err);
			}); else if(updateList.length > 0) _g1.updateObjects(updateList,cb);
		};
		if(autoAttach) this.attach(objs,false,function(err1) {
			if(err1 == null) run(); else cb(err1);
		}); else run();
	}
	,uploadFile: function(contents,file_identifier,cb) {
		if(file_identifier == null) bindings.NodeTemp.open("upload_file",function(err,info) {
			if(err != null) cb(err,null); else {
				var buffer = new Buffer(contents,"base64");
				js.Node.require("fs").writeFile(info.path,buffer,function(err1) {
					if(err1 != null) cb(err1,null); else {
						var client = saturn.app.SaturnServer.getDefaultServer().getRedisClient();
						var uuid = js.Node.require("node-uuid");
						var upload_key = "file_upload:" + uuid.v4();
						client.set(upload_key,info.path);
						cb(null,upload_key);
					}
				});
			}
		}); else {
			var client1 = saturn.app.SaturnServer.getDefaultServer().getRedisClient();
			client1.get(file_identifier,function(err2,filePath) {
				if(err2 != null) cb(err2,null); else {
					var decodedContents = new Buffer(contents,"base64");
					js.Node.require("fs").appendFile(filePath,decodedContents,function(err3) {
						cb(err3,file_identifier);
					});
				}
			});
		}
		return null;
	}
	,__class__: saturn.db.DefaultProvider
};
saturn.db.NamedQueryCache = $hxClasses["saturn.db.NamedQueryCache"] = function() {
};
saturn.db.NamedQueryCache.__name__ = ["saturn","db","NamedQueryCache"];
saturn.db.NamedQueryCache.prototype = {
	queryName: null
	,queryParamSerial: null
	,queryParams: null
	,queryResults: null
	,__class__: saturn.db.NamedQueryCache
};
saturn.db.Model = $hxClasses["saturn.db.Model"] = function(model,name) {
	this.customSearchFunctionPath = null;
	this.theModel = model;
	this.theName = name;
	this.alias = "";
	this.actionMap = new haxe.ds.StringMap();
	if(this.theModel.exists("indexes")) {
		var i = 0;
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.theModel.get("indexes");
			$r = this1.keys();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var keyName = $it0.next();
			if(i == 0) this.busSingleColKey = keyName;
			if((function($this) {
				var $r;
				var this2 = $this.theModel.get("indexes");
				$r = this2.get(keyName);
				return $r;
			}(this))) this.priColKey = keyName;
			i++;
		}
	}
	if(this.theModel.exists("provider_name")) {
		var name1;
		name1 = js.Boot.__cast(this.theModel.get("provider_name") , String);
		this.setProviderName(name1);
	}
	if(this.theModel.exists("programs")) {
		this.programs = [];
		var $it1 = (function($this) {
			var $r;
			var this3 = $this.theModel.get("programs");
			$r = this3.keys();
			return $r;
		}(this));
		while( $it1.hasNext() ) {
			var program = $it1.next();
			this.programs.push(program);
		}
	}
	this.stripIdPrefix = false;
	this.autoActivate = -1;
	if(this.theModel.exists("options")) {
		var options = this.theModel.get("options");
		if(__map_reserved.id_pattern != null?options.existsReserved("id_pattern"):options.h.hasOwnProperty("id_pattern")) this.setIdRegEx(__map_reserved.id_pattern != null?options.getReserved("id_pattern"):options.h["id_pattern"]);
		if(__map_reserved.custom_search_function != null?options.existsReserved("custom_search_function"):options.h.hasOwnProperty("custom_search_function")) this.customSearchFunctionPath = __map_reserved.custom_search_function != null?options.getReserved("custom_search_function"):options.h["custom_search_function"];
		if(__map_reserved.constraints != null?options.existsReserved("constraints"):options.h.hasOwnProperty("constraints")) {
			if((__map_reserved.constraints != null?options.getReserved("constraints"):options.h["constraints"]).exists("user_constraint_field")) this.userConstraintField = (__map_reserved.constraints != null?options.getReserved("constraints"):options.h["constraints"]).get("user_constraint_field");
			if((__map_reserved.constraints != null?options.getReserved("constraints"):options.h["constraints"]).exists("public_constraint_field")) this.publicConstraintField = (__map_reserved.constraints != null?options.getReserved("constraints"):options.h["constraints"]).get("public_constraint_field");
		}
		if(__map_reserved.windows_allowed_paths != null?options.getReserved("windows_allowed_paths"):options.h["windows_allowed_paths"]) {
			var value = this.compileRegEx(__map_reserved.windows_allowed_paths != null?options.getReserved("windows_allowed_paths"):options.h["windows_allowed_paths"]);
			options.set("windows_allowed_paths_regex",value);
		}
		if(__map_reserved.linux_allowed_paths != null?options.getReserved("linux_allowed_paths"):options.h["linux_allowed_paths"]) {
			var value1 = this.compileRegEx(__map_reserved.linux_allowed_paths != null?options.getReserved("linux_allowed_paths"):options.h["linux_allowed_paths"]);
			options.set("linux_allowed_paths_regex",value1);
		}
		if(__map_reserved.strip_id_prefix != null?options.existsReserved("strip_id_prefix"):options.h.hasOwnProperty("strip_id_prefix")) this.stripIdPrefix = __map_reserved.strip_id_prefix != null?options.getReserved("strip_id_prefix"):options.h["strip_id_prefix"];
		if(__map_reserved.alias != null?options.existsReserved("alias"):options.h.hasOwnProperty("alias")) this.alias = __map_reserved.alias != null?options.getReserved("alias"):options.h["alias"];
		if(__map_reserved.flags != null?options.existsReserved("flags"):options.h.hasOwnProperty("flags")) this.flags = __map_reserved.flags != null?options.getReserved("flags"):options.h["flags"]; else this.flags = new haxe.ds.StringMap();
		if(__map_reserved["file.new.label"] != null?options.existsReserved("file.new.label"):options.h.hasOwnProperty("file.new.label")) this.file_new_label = __map_reserved["file.new.label"] != null?options.getReserved("file.new.label"):options.h["file.new.label"];
		if(__map_reserved.auto_activate != null?options.existsReserved("auto_activate"):options.h.hasOwnProperty("auto_activate")) this.autoActivate = Std.parseInt(__map_reserved.auto_activate != null?options.getReserved("auto_activate"):options.h["auto_activate"]);
		if(__map_reserved.actions != null?options.existsReserved("actions"):options.h.hasOwnProperty("actions")) {
			var actionTypeMap;
			actionTypeMap = __map_reserved.actions != null?options.getReserved("actions"):options.h["actions"];
			var $it2 = actionTypeMap.keys();
			while( $it2.hasNext() ) {
				var actionType = $it2.next();
				var actions;
				actions = __map_reserved[actionType] != null?actionTypeMap.getReserved(actionType):actionTypeMap.h[actionType];
				var value2 = new haxe.ds.StringMap();
				this.actionMap.set(actionType,value2);
				var $it3 = actions.keys();
				while( $it3.hasNext() ) {
					var actionName = $it3.next();
					var actionDef;
					actionDef = __map_reserved[actionName] != null?actions.getReserved(actionName):actions.h[actionName];
					if(!(__map_reserved.user_suffix != null?actionDef.existsReserved("user_suffix"):actionDef.h.hasOwnProperty("user_suffix"))) throw new js._Boot.HaxeError(new saturn.util.HaxeException(actionName + " action definition for " + this.getName() + " is missing user_suffix option"));
					if(!(__map_reserved["function"] != null?actionDef.existsReserved("function"):actionDef.h.hasOwnProperty("function"))) throw new js._Boot.HaxeError(new saturn.util.HaxeException(actionName + " action definition for " + this.getName() + " is missing function option"));
					var action = new saturn.db.ModelAction(actionName,__map_reserved.user_suffix != null?actionDef.getReserved("user_suffix"):actionDef.h["user_suffix"],__map_reserved["function"] != null?actionDef.getReserved("function"):actionDef.h["function"],__map_reserved.icon != null?actionDef.getReserved("icon"):actionDef.h["icon"]);
					if(actionType == "search_bar") {
						var clazz = Type.resolveClass(action.className);
						if(clazz == null) throw new js._Boot.HaxeError(new saturn.util.HaxeException(action.className + " does not exist for action " + actionName));
						var instanceFields = Type.getInstanceFields(clazz);
						var match = false;
						var _g = 0;
						while(_g < instanceFields.length) {
							var field = instanceFields[_g];
							++_g;
							if(field == action.functionName) {
								match = true;
								break;
							}
						}
						if(!match) throw new js._Boot.HaxeError(new saturn.util.HaxeException(action.className + " does not have function " + action.functionName + " for action " + actionName));
					}
					var this4 = this.actionMap.get(actionType);
					this4.set(actionName,action);
				}
			}
		}
	} else {
		this.flags = new haxe.ds.StringMap();
		var value3 = new haxe.ds.StringMap();
		this.actionMap.set("searchBar",value3);
	}
	if(this.theModel.exists("search")) {
		var fts = this.theModel.get("search");
		this.ftsColumns = new haxe.ds.StringMap();
		var $it4 = fts.keys();
		while( $it4.hasNext() ) {
			var key = $it4.next();
			var searchDef;
			searchDef = __map_reserved[key] != null?fts.getReserved(key):fts.h[key];
			var searchObj = new saturn.db.SearchDef();
			if(searchDef != null) {
				if(typeof(searchDef) == "boolean" && searchDef) this.ftsColumns.set(key,searchObj); else if(typeof(searchDef) == "string") searchObj.regex = new EReg(searchDef,""); else {
					if(searchDef.exists("search_when")) {
						var regexStr = searchDef.get("search_when");
						if(regexStr != null && regexStr != "") searchObj.regex = new EReg(regexStr,"");
					}
					if(searchDef.exists("replace_with")) searchObj.replaceWith = searchDef.get("replace_with");
				}
			}
			this.ftsColumns.set(key,searchObj);
		}
	}
	if(this.alias == null || this.alias == "") this.alias = this.theName;
};
saturn.db.Model.__name__ = ["saturn","db","Model"];
saturn.db.Model.generateIDMap = function(objs) {
	if(objs == null || objs.length == 0) return null; else {
		var map = new haxe.ds.StringMap();
		var model = saturn.core.Util.getProvider().getModel(Type.getClass(objs[0]));
		var firstKey = model.getFirstKey();
		var priKey = model.getPrimaryKey();
		var _g = 0;
		while(_g < objs.length) {
			var obj = objs[_g];
			++_g;
			var key = Reflect.field(obj,firstKey);
			var value = Reflect.field(obj,priKey);
			if(__map_reserved[key] != null) map.setReserved(key,value); else map.h[key] = value;
		}
		return map;
	}
};
saturn.db.Model.generateUniqueList = function(objs) {
	if(objs == null || objs.length == 0) return null; else {
		var model = saturn.core.Util.getProvider().getModel(Type.getClass(objs[0]));
		var firstKey = model.getFirstKey();
		return saturn.db.Model.generateUniqueListWithField(objs,firstKey);
	}
};
saturn.db.Model.generateUniqueListWithField = function(objs,field) {
	var set = new haxe.ds.StringMap();
	var _g = 0;
	while(_g < objs.length) {
		var obj = objs[_g];
		++_g;
		var key = saturn.db.Model.extractField(obj,field);
		if(__map_reserved[key] != null) set.setReserved(key,null); else set.h[key] = null;
	}
	var ids = [];
	var $it0 = set.keys();
	while( $it0.hasNext() ) {
		var key1 = $it0.next();
		ids.push(key1);
	}
	return ids;
};
saturn.db.Model.extractField = function(obj,field) {
	if(field.indexOf(".") < 0) return Reflect.field(obj,field); else {
		var a = field.indexOf(".") - 1;
		var nextField = field.substring(0,a + 1);
		var nextObj = Reflect.field(obj,nextField);
		var remaining = field.substring(a + 2,field.length);
		return saturn.db.Model.extractField(nextObj,remaining);
	}
};
saturn.db.Model.setField = function(obj,field,value,newTerminal) {
	if(newTerminal == null) newTerminal = false;
	if(field.indexOf(".") < 0) obj[field] = value; else {
		var a = field.indexOf(".") - 1;
		var nextField = field.substring(0,a + 1);
		var nextObj = Reflect.field(obj,nextField);
		var remaining = field.substring(a + 2,field.length);
		if(nextObj == null || newTerminal && remaining.indexOf(".") < 0) {
			var clazz = Type.getClass(obj);
			if(clazz != null) {
				var model = saturn.core.Util.getProvider().getModel(clazz);
				var synthDef;
				var this1 = model.getSynthenticFields();
				synthDef = this1.get(nextField);
				if(synthDef != null) {
					var clazzStr = synthDef.get("class");
					nextObj = Type.createInstance(Type.resolveClass(clazzStr),[]);
					obj[nextField] = nextObj;
					Reflect.setField(obj,synthDef.field,null);
				}
			}
		}
		saturn.db.Model.setField(nextObj,remaining,value);
	}
};
saturn.db.Model.getModel = function(obj) {
	return saturn.core.Util.getProvider().getModel(Type.getClass(obj));
};
saturn.db.Model.generateMap = function(objs) {
	var model = saturn.db.Model.getModel(objs[0]);
	var firstKey = model.getFirstKey();
	return saturn.db.Model.generateMapWithField(objs,firstKey);
};
saturn.db.Model.generateMapWithField = function(objs,field) {
	var map = new haxe.ds.StringMap();
	var _g = 0;
	while(_g < objs.length) {
		var obj = objs[_g];
		++_g;
		var key = saturn.db.Model.extractField(obj,field);
		var value = obj;
		map.set(key,value);
	}
	return map;
};
saturn.db.Model.prototype = {
	theModel: null
	,theName: null
	,busSingleColKey: null
	,priColKey: null
	,idRegEx: null
	,stripIdPrefix: null
	,file_new_label: null
	,searchMap: null
	,ftsColumns: null
	,alias: null
	,programs: null
	,flags: null
	,autoActivate: null
	,actionMap: null
	,providerName: null
	,publicConstraintField: null
	,userConstraintField: null
	,customSearchFunctionPath: null
	,getFileNewLabel: function() {
		return this.file_new_label;
	}
	,isProgramSaveAs: function(clazzName) {
		if(this.theModel.exists("programs") && (function($this) {
			var $r;
			var this1 = $this.theModel.get("programs");
			$r = this1.get(clazzName);
			return $r;
		}(this))) return true; else if((function($this) {
			var $r;
			var this2 = $this.theModel.get("options");
			$r = this2.exists("canSave");
			return $r;
		}(this))) return ((function($this) {
			var $r;
			var this3 = $this.theModel.get("options");
			$r = this3.get("canSave");
			return $r;
		}(this))).get(clazzName); else return false;
	}
	,getProviderName: function() {
		return this.providerName;
	}
	,setProviderName: function(name) {
		this.providerName = name;
	}
	,getActions: function(actionType) {
		if(this.actionMap.exists(actionType)) return this.actionMap.get(actionType); else return new haxe.ds.StringMap();
	}
	,getAutoActivateLevel: function() {
		return this.autoActivate;
	}
	,hasFlag: function(flag) {
		if(this.flags.exists(flag)) return this.flags.get(flag); else return false;
	}
	,getCustomSearchFunction: function() {
		return this.customSearchFunctionPath;
	}
	,getPrograms: function() {
		return this.programs;
	}
	,getAlias: function() {
		return this.alias;
	}
	,getFTSColumns: function() {
		if(this.ftsColumns != null) return this.ftsColumns; else return null;
	}
	,getSearchMap: function() {
		return this.searchMap;
	}
	,getOptions: function() {
		return this.theModel.get("options");
	}
	,compileRegEx: function(regexs) {
		var cregexs = new haxe.ds.StringMap();
		var $it0 = regexs.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var regex;
			regex = __map_reserved[key] != null?regexs.getReserved(key):regexs.h[key];
			if(regex != "") {
				var value = new EReg(regex,"");
				if(__map_reserved[key] != null) cregexs.setReserved(key,value); else cregexs.h[key] = value;
			}
		}
		return cregexs;
	}
	,setIdRegEx: function(idRegExStr) {
		this.idRegEx = new EReg(idRegExStr,"");
	}
	,getIdRegEx: function() {
		return this.idRegEx;
	}
	,isValidId: function(id) {
		if(this.idRegEx != null) return this.idRegEx.match(id); else return false;
	}
	,stripPrefixes: function() {
		return this.stripIdPrefix;
	}
	,processId: function(id) {
		if(this.stripIdPrefix) id = this.idRegEx.replace(id,"");
		return id;
	}
	,getIndexes: function() {
		var indexFields = [];
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.theModel.get("indexes");
			$r = this1.keys();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var keyName = $it0.next();
			indexFields.push(keyName);
		}
		return indexFields;
	}
	,getAutoFunctions: function() {
		if(this.theModel.exists("auto_functions")) return this.theModel.get("auto_functions"); else return null;
	}
	,getFields: function() {
		var fields = [];
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.theModel.get("model");
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var field = $it0.next();
			fields.push(field);
		}
		return fields;
	}
	,getAttributes: function() {
		var fields = [];
		if(this.theModel.exists("fields")) {
			var $it0 = (function($this) {
				var $r;
				var this1 = $this.theModel.get("fields");
				$r = this1.keys();
				return $r;
			}(this));
			while( $it0.hasNext() ) {
				var field = $it0.next();
				fields.push(field);
			}
		}
		return fields;
	}
	,isField: function(field) {
		var this1 = this.theModel.get("fields");
		return this1.exists(field);
	}
	,isRDBMSField: function(rdbmsField) {
		var fields = this.theModel.get("fields");
		var $it0 = fields.keys();
		while( $it0.hasNext() ) {
			var field = $it0.next();
			if((__map_reserved[field] != null?fields.getReserved(field):fields.h[field]) == rdbmsField) return true;
		}
		return false;
	}
	,modelAtrributeToRDBMS: function(field) {
		var this1 = this.theModel.get("fields");
		return this1.get(field);
	}
	,hasDefaults: function() {
		return this.theModel.exists("defaults");
	}
	,hasOptions: function() {
		return this.theModel.exists("options");
	}
	,getFieldDefault: function(field) {
		if(this.hasDefaults() && (function($this) {
			var $r;
			var this1 = $this.theModel.get("defaults");
			$r = this1.exists(field);
			return $r;
		}(this))) {
			var this2 = this.theModel.get("defaults");
			return this2.get(field);
		} else return null;
	}
	,hasRequired: function() {
		return this.theModel.exists("required");
	}
	,isRequired: function(field) {
		if(this.hasRequired()) {
			if((function($this) {
				var $r;
				var this1 = $this.theModel.get("required");
				$r = this1.exists(field);
				return $r;
			}(this))) return true; else if(field.indexOf(".") > 0) {
				var cmps = field.split(".");
				var refField = this.getSyntheticallyBoundField(cmps[0]);
				return this.isRequired(refField);
			}
		}
		return false;
	}
	,getFieldDefs: function() {
		var fields = [];
		var defaults = null;
		if(this.theModel.exists("defaults")) defaults = this.theModel.get("defaults"); else return this.getFields();
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.theModel.get("model");
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var field = $it0.next();
			var val = null;
			if(__map_reserved[field] != null?defaults.existsReserved(field):defaults.h.hasOwnProperty(field)) {
				var this2 = this.theModel.get("defaults");
				val = this2.get(field);
			}
			fields.push({ name : field, defaultValue : val});
		}
		return fields;
	}
	,getUserFieldDefinitions: function() {
		var fields = [];
		var defaults = null;
		if(this.theModel.exists("defaults")) defaults = this.theModel.get("defaults"); else defaults = new haxe.ds.StringMap();
		var model = this.theModel.get("model");
		if(model == null) return null;
		var $it0 = model.keys();
		while( $it0.hasNext() ) {
			var field = $it0.next();
			var val = null;
			if(__map_reserved[field] != null?defaults.existsReserved(field):defaults.h.hasOwnProperty(field)) {
				var this1 = this.theModel.get("defaults");
				val = this1.get(field);
			}
			fields.push({ name : field, defaultValue : val, field : (function($this) {
				var $r;
				var this2 = $this.theModel.get("model");
				$r = this2.get(field);
				return $r;
			}(this))});
		}
		return fields;
	}
	,convertUserFieldName: function(userFieldName) {
		if(this.theModel.exists("model")) {
			if((function($this) {
				var $r;
				var this1 = $this.theModel.get("model");
				$r = this1.exists(userFieldName);
				return $r;
			}(this))) {
				var this2 = this.theModel.get("model");
				return this2.get(userFieldName);
			} else return null;
		} else return null;
	}
	,getExtTableDefinition: function() {
		var tableDefinition = [];
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.theModel.get("model");
			$r = this1.keys();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var name = $it0.next();
			var field;
			var this2 = this.theModel.get("model");
			field = this2.get(name);
			var def = { header : name, dataIndex : field, editor : "textfield"};
			if(this.isRequired(field)) {
				def.tdCls = "required-column";
				def.allowBlank = false;
			}
			tableDefinition.push(def);
		}
		return tableDefinition;
	}
	,getSynthenticFields: function() {
		return this.theModel.get("fields.synthetic");
	}
	,isSyntheticallyBound: function(fieldName) {
		var synthFields = this.theModel.get("fields.synthetic");
		if(synthFields != null) {
			var $it0 = synthFields.keys();
			while( $it0.hasNext() ) {
				var syntheticFieldName = $it0.next();
				if((__map_reserved[syntheticFieldName] != null?synthFields.getReserved(syntheticFieldName):synthFields.h[syntheticFieldName]).get("field") == fieldName) return true;
			}
		}
		return false;
	}
	,isSynthetic: function(fieldName) {
		if(this.theModel.exists("fields.synthetic")) {
			var this1 = this.theModel.get("fields.synthetic");
			return this1.exists(fieldName);
		} else return false;
	}
	,getPseudoSyntheticObjectName: function(fieldName) {
		if(this.theModel.exists("fields.synthetic")) {
			var $it0 = (function($this) {
				var $r;
				var this1 = $this.theModel.get("fields.synthetic");
				$r = this1.keys();
				return $r;
			}(this));
			while( $it0.hasNext() ) {
				var objName = $it0.next();
				if(((function($this) {
					var $r;
					var this2 = $this.theModel.get("fields.synthetic");
					$r = this2.get(objName);
					return $r;
				}(this))).get("fk_field") == null) {
					var boundField = ((function($this) {
						var $r;
						var this3 = $this.theModel.get("fields.synthetic");
						$r = this3.get(objName);
						return $r;
					}(this))).get("field");
					if(fieldName == boundField) return objName;
				}
			}
		}
		return null;
	}
	,getSyntheticallyBoundField: function(syntheticFieldName) {
		if(this.theModel.exists("fields.synthetic")) {
			if((function($this) {
				var $r;
				var this1 = $this.theModel.get("fields.synthetic");
				$r = this1.exists(syntheticFieldName);
				return $r;
			}(this))) return ((function($this) {
				var $r;
				var this2 = $this.theModel.get("fields.synthetic");
				$r = this2.get(syntheticFieldName);
				return $r;
			}(this))).get("field");
		}
		return null;
	}
	,getClass: function() {
		return Type.resolveClass(this.theName);
	}
	,getFirstKey: function() {
		return this.busSingleColKey;
	}
	,getIcon: function() {
		if(this.hasOptions()) {
			if((function($this) {
				var $r;
				var this1 = $this.getOptions();
				$r = this1.exists("icon");
				return $r;
			}(this))) {
				var this2 = this.getOptions();
				return this2.get("icon");
			}
		}
		return "";
	}
	,getWorkspaceWrapper: function() {
		if(this.hasOptions()) {
			if((function($this) {
				var $r;
				var this1 = $this.getOptions();
				$r = this1.exists("workspace_wrapper");
				return $r;
			}(this))) {
				var this2 = this.getOptions();
				return this2.get("workspace_wrapper");
			}
		}
		return "";
	}
	,getWorkspaceWrapperClass: function() {
		return Type.resolveClass(this.getWorkspaceWrapper());
	}
	,getPrimaryKey: function() {
		return this.priColKey;
	}
	,getName: function() {
		return this.theName;
	}
	,getExtModelName: function() {
		return this.theName + ".MODEL";
	}
	,getExtStoreName: function() {
		return this.theName + ".STORE";
	}
	,getFirstKey_rdbms: function() {
		var this1 = this.theModel.get("fields");
		var key = this.getFirstKey();
		return this1.get(key);
	}
	,getSqlColumn: function(field) {
		var this1 = this.theModel.get("fields");
		return this1.get(field);
	}
	,unbindFieldName: function(field) {
		return this.getSqlColumn(field);
	}
	,getPrimaryKey_rdbms: function() {
		var this1 = this.theModel.get("fields");
		var key = this.getPrimaryKey();
		return this1.get(key);
	}
	,getSchemaName: function() {
		var this1 = this.theModel.get("table_info");
		return this1.get("schema");
	}
	,getTableName: function() {
		var this1 = this.theModel.get("table_info");
		return this1.get("name");
	}
	,getQualifiedTableName: function() {
		var schemaName = this.getSchemaName();
		if(schemaName == null || schemaName == "") return this.getTableName(); else return this.getSchemaName() + "." + this.getTableName();
	}
	,hasTableInfo: function() {
		return this.theModel.exists("table_info");
	}
	,getSelectClause: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("SELECT");
	}
	,setInsertClause: function(insertClause) {
		var this1 = this.theModel.get("statements");
		this1.set("INSERT",insertClause);
	}
	,getInsertClause: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("INSERT");
	}
	,setUpdateClause: function(updateClause) {
		var this1 = this.theModel.get("statements");
		this1.set("UPDATE",updateClause);
	}
	,getUpdateClause: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("UPDATE");
	}
	,setDeleteClause: function(deleteClause) {
		var this1 = this.theModel.get("statements");
		this1.set("DELETE",deleteClause);
	}
	,getDeleteClause: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("DELETE");
	}
	,setSelectKeyClause: function(selKeyClause) {
		var this1 = this.theModel.get("statements");
		this1.set("SELECT_KEY",selKeyClause);
	}
	,getSelectKeyClause: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("SELECT_KEY");
	}
	,setColumns: function(columns) {
		var this1 = this.theModel.get("statements");
		this1.set("COLUMNS",columns);
		var colSet = new haxe.ds.StringMap();
		var _g = 0;
		while(_g < columns.length) {
			var column = columns[_g];
			++_g;
			if(__map_reserved[column] != null) colSet.setReserved(column,""); else colSet.h[column] = "";
		}
		var this2 = this.theModel.get("statements");
		this2.set("COLUMNS_SET",colSet);
	}
	,getColumns: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("COLUMNS");
	}
	,getColumnSet: function() {
		var this1 = this.theModel.get("statements");
		return this1.get("COLUMNS_SET");
	}
	,getSelectorField: function() {
		if(this.theModel.exists("selector")) {
			var this1 = this.theModel.get("selector");
			return this1.get("polymorph_key");
		} else return null;
	}
	,getSelectorValue: function() {
		var this1 = this.theModel.get("selector");
		return this1.get("value");
	}
	,isPolymorph: function() {
		return this.theModel.exists("selector");
	}
	,getUserConstraintField: function() {
		return this.userConstraintField;
	}
	,getPublicConstraintField: function() {
		return this.publicConstraintField;
	}
	,__class__: saturn.db.Model
};
saturn.db.SearchDef = $hxClasses["saturn.db.SearchDef"] = function() {
	this.replaceWith = null;
	this.regex = null;
};
saturn.db.SearchDef.__name__ = ["saturn","db","SearchDef"];
saturn.db.SearchDef.prototype = {
	regex: null
	,replaceWith: null
	,__class__: saturn.db.SearchDef
};
saturn.db.ModelAction = $hxClasses["saturn.db.ModelAction"] = function(name,userSuffix,qName,icon) {
	this.name = name;
	this.userSuffix = userSuffix;
	this.setQualifiedName(qName);
	this.icon = icon;
};
saturn.db.ModelAction.__name__ = ["saturn","db","ModelAction"];
saturn.db.ModelAction.prototype = {
	name: null
	,userSuffix: null
	,functionName: null
	,className: null
	,icon: null
	,setQualifiedName: function(qName) {
		var i = qName.lastIndexOf(".");
		this.functionName = qName.substring(i + 1,qName.length);
		this.className = qName.substring(0,i);
	}
	,run: function(obj,cb) {
		Reflect.callMethod(obj,Reflect.field(obj,this.functionName),[cb]);
	}
	,__class__: saturn.db.ModelAction
};
saturn.db.NodePool = $hxClasses["saturn.db.NodePool"] = function() { };
saturn.db.NodePool.__name__ = ["saturn","db","NodePool"];
saturn.db.NodePool.generatePool = function(name,max,min,idleTimeout,log,createCb,destroyCb) {
	var genericPool = js.Node.require("generic-pool");
	var d = { 'name' : name, 'create' : createCb, 'destroy' : destroyCb, 'max' : max, 'min' : min, 'idleTimeoutMillis' : idleTimeout, 'log' : log};
	var pool = genericPool.Pool(d);
	return pool;
};
saturn.db.Pool = $hxClasses["saturn.db.Pool"] = function() { };
saturn.db.Pool.__name__ = ["saturn","db","Pool"];
saturn.db.Pool.prototype = {
	acquire: null
	,release: null
	,drain: null
	,destroyAllNow: null
	,__class__: saturn.db.Pool
};
if(!saturn.db.mapping) saturn.db.mapping = {};
saturn.db.mapping.FamaPublic = $hxClasses["saturn.db.mapping.FamaPublic"] = function() { };
saturn.db.mapping.FamaPublic.__name__ = ["saturn","db","mapping","FamaPublic"];
saturn.db.mapping.KIR = $hxClasses["saturn.db.mapping.KIR"] = function() {
	this.buildModels();
};
saturn.db.mapping.KIR.__name__ = ["saturn","db","mapping","KIR"];
saturn.db.mapping.KIR.prototype = {
	models: null
	,buildModels: function() {
		var _g = new haxe.ds.StringMap();
		var value;
		var _g1 = new haxe.ds.StringMap();
		var value1;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.experimentNo != null) _g2.setReserved("experimentNo","Experiment_No"); else _g2.h["experimentNo"] = "Experiment_No";
		if(__map_reserved.id != null) _g2.setReserved("id","Id"); else _g2.h["id"] = "Id";
		if(__map_reserved.dateStarted != null) _g2.setReserved("dateStarted","Date_Started"); else _g2.h["dateStarted"] = "Date_Started";
		if(__map_reserved.title != null) _g2.setReserved("title","Title"); else _g2.h["title"] = "Title";
		if(__map_reserved.userId != null) _g2.setReserved("userId","UserId"); else _g2.h["userId"] = "UserId";
		if(__map_reserved.elnDocumentId != null) _g2.setReserved("elnDocumentId","ELNDOCUMENTID"); else _g2.h["elnDocumentId"] = "ELNDOCUMENTID";
		if(__map_reserved.minEditableItem != null) _g2.setReserved("minEditableItem","Min_Editable_Item"); else _g2.h["minEditableItem"] = "Min_Editable_Item";
		if(__map_reserved.lastEdited != null) _g2.setReserved("lastEdited","Last_Edited"); else _g2.h["lastEdited"] = "Last_Edited";
		if(__map_reserved.user != null) _g2.setReserved("user","User"); else _g2.h["user"] = "User";
		if(__map_reserved.sharingAllowed != null) _g2.setReserved("sharingAllowed","SharingAllowed"); else _g2.h["sharingAllowed"] = "SharingAllowed";
		if(__map_reserved.personalTemplate != null) _g2.setReserved("personalTemplate","PersonalTemplate"); else _g2.h["personalTemplate"] = "PersonalTemplate";
		if(__map_reserved.globalTemplate != null) _g2.setReserved("globalTemplate","GlocalTemplate"); else _g2.h["globalTemplate"] = "GlocalTemplate";
		if(__map_reserved.dateExperimentStarted != null) _g2.setReserved("dateExperimentStarted","Date_ExperimentStarted"); else _g2.h["dateExperimentStarted"] = "Date_ExperimentStarted";
		value1 = _g2;
		if(__map_reserved.fields != null) _g1.setReserved("fields",value1); else _g1.h["fields"] = value1;
		var value2;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.sharingAllowed != null) _g3.setReserved("sharingAllowed","NO"); else _g3.h["sharingAllowed"] = "NO";
		if(__map_reserved.personalTemplate != null) _g3.setReserved("personalTemplate","NO"); else _g3.h["personalTemplate"] = "NO";
		if(__map_reserved.globalTemplate != null) _g3.setReserved("globalTemplate","NO"); else _g3.h["globalTemplate"] = "NO";
		value2 = _g3;
		if(__map_reserved.defaults != null) _g1.setReserved("defaults",value2); else _g1.h["defaults"] = value2;
		var value3;
		var _g4 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g4.setReserved("id","1"); else _g4.h["id"] = "1";
		if(__map_reserved.experimentNo != null) _g4.setReserved("experimentNo","1"); else _g4.h["experimentNo"] = "1";
		value3 = _g4;
		if(__map_reserved.required != null) _g1.setReserved("required",value3); else _g1.h["required"] = value3;
		var value4;
		var _g5 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g5.setReserved("schema","icmdb_page_secure"); else _g5.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g5.setReserved("name","V_LABPAGE"); else _g5.h["name"] = "V_LABPAGE";
		value4 = _g5;
		if(__map_reserved.table_info != null) _g1.setReserved("table_info",value4); else _g1.h["table_info"] = value4;
		var value5;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved["Experiment No"] != null) _g6.setReserved("Experiment No","experimentNo"); else _g6.h["Experiment No"] = "experimentNo";
		if(__map_reserved.ID != null) _g6.setReserved("ID","id"); else _g6.h["ID"] = "id";
		if(__map_reserved["Date Started"] != null) _g6.setReserved("Date Started","dateStarted"); else _g6.h["Date Started"] = "dateStarted";
		if(__map_reserved.Title != null) _g6.setReserved("Title","title"); else _g6.h["Title"] = "title";
		if(__map_reserved["User ID"] != null) _g6.setReserved("User ID","userId"); else _g6.h["User ID"] = "userId";
		if(__map_reserved["ELN Document ID"] != null) _g6.setReserved("ELN Document ID","elnDocumentId"); else _g6.h["ELN Document ID"] = "elnDocumentId";
		if(__map_reserved["Min Editable Item"] != null) _g6.setReserved("Min Editable Item","minEditableItem"); else _g6.h["Min Editable Item"] = "minEditableItem";
		if(__map_reserved["Last Edited"] != null) _g6.setReserved("Last Edited","lastEdited"); else _g6.h["Last Edited"] = "lastEdited";
		if(__map_reserved.User != null) _g6.setReserved("User","user"); else _g6.h["User"] = "user";
		if(__map_reserved["Sharing Allowed"] != null) _g6.setReserved("Sharing Allowed","sharingAllowed"); else _g6.h["Sharing Allowed"] = "sharingAllowed";
		if(__map_reserved["Personal Template"] != null) _g6.setReserved("Personal Template","personalTemplate"); else _g6.h["Personal Template"] = "personalTemplate";
		if(__map_reserved["Global Template"] != null) _g6.setReserved("Global Template","globalTemplate"); else _g6.h["Global Template"] = "globalTemplate";
		if(__map_reserved["Date Experiment Started"] != null) _g6.setReserved("Date Experiment Started","dateExperimentStarted"); else _g6.h["Date Experiment Started"] = "dateExperimentStarted";
		value5 = _g6;
		if(__map_reserved.model != null) _g1.setReserved("model",value5); else _g1.h["model"] = value5;
		var value6;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved.experimentNo != null) _g7.setReserved("experimentNo",false); else _g7.h["experimentNo"] = false;
		if(__map_reserved.id != null) _g7.setReserved("id",true); else _g7.h["id"] = true;
		value6 = _g7;
		if(__map_reserved.indexes != null) _g1.setReserved("indexes",value6); else _g1.h["indexes"] = value6;
		var value7;
		var _g8 = new haxe.ds.StringMap();
		var value8;
		var _g9 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g9.setReserved("field","id"); else _g9.h["field"] = "id";
		if(__map_reserved["class"] != null) _g9.setReserved("class","saturn.core.scarab.LabPageItem"); else _g9.h["class"] = "saturn.core.scarab.LabPageItem";
		if(__map_reserved.fk_field != null) _g9.setReserved("fk_field","labPage"); else _g9.h["fk_field"] = "labPage";
		value8 = _g9;
		_g8.set("items",value8);
		var value9;
		var _g10 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g10.setReserved("field","user"); else _g10.h["field"] = "user";
		if(__map_reserved["class"] != null) _g10.setReserved("class","saturn.core.scarab.LabPageUser"); else _g10.h["class"] = "saturn.core.scarab.LabPageUser";
		if(__map_reserved.fk_field != null) _g10.setReserved("fk_field","id"); else _g10.h["fk_field"] = "id";
		value9 = _g10;
		_g8.set("userObj",value9);
		value7 = _g8;
		if(__map_reserved["fields.synthetic"] != null) _g1.setReserved("fields.synthetic",value7); else _g1.h["fields.synthetic"] = value7;
		var value10;
		var _g11 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g11.setReserved("id_pattern","PAGE.+"); else _g11.h["id_pattern"] = "PAGE.+";
		if(__map_reserved.icon != null) _g11.setReserved("icon","structure_16.png"); else _g11.h["icon"] = "structure_16.png";
		if(__map_reserved.workspace_wrapper != null) _g11.setReserved("workspace_wrapper","saturn.client.workspace.ScarabELNWO"); else _g11.h["workspace_wrapper"] = "saturn.client.workspace.ScarabELNWO";
		if(__map_reserved.alias != null) _g11.setReserved("alias","ELN"); else _g11.h["alias"] = "ELN";
		if(__map_reserved.display_field != null) _g11.setReserved("display_field","title"); else _g11.h["display_field"] = "title";
		value10 = _g11;
		if(__map_reserved.options != null) _g1.setReserved("options",value10); else _g1.h["options"] = value10;
		var value11;
		var _g12 = new haxe.ds.StringMap();
		if(__map_reserved.title != null) _g12.setReserved("title",null); else _g12.h["title"] = null;
		if(__map_reserved["userObj.fullName"] != null) _g12.setReserved("userObj.fullName",null); else _g12.h["userObj.fullName"] = null;
		value11 = _g12;
		if(__map_reserved.search != null) _g1.setReserved("search",value11); else _g1.h["search"] = value11;
		var value12;
		var _g13 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ScarabELNViewer"] != null) _g13.setReserved("saturn.client.programs.ScarabELNViewer",true); else _g13.h["saturn.client.programs.ScarabELNViewer"] = true;
		value12 = _g13;
		if(__map_reserved.programs != null) _g1.setReserved("programs",value12); else _g1.h["programs"] = value12;
		value = _g1;
		if(__map_reserved["saturn.core.scarab.LabPage"] != null) _g.setReserved("saturn.core.scarab.LabPage",value); else _g.h["saturn.core.scarab.LabPage"] = value;
		var value13;
		var _g14 = new haxe.ds.StringMap();
		var value14;
		var _g15 = new haxe.ds.StringMap();
		if(__map_reserved.labPage != null) _g15.setReserved("labPage","Labpage"); else _g15.h["labPage"] = "Labpage";
		if(__map_reserved.order != null) _g15.setReserved("order","Num"); else _g15.h["order"] = "Num";
		if(__map_reserved.id != null) _g15.setReserved("id","Id"); else _g15.h["id"] = "Id";
		if(__map_reserved.name != null) _g15.setReserved("name","Name"); else _g15.h["name"] = "Name";
		if(__map_reserved.caption != null) _g15.setReserved("caption","Caption"); else _g15.h["caption"] = "Caption";
		if(__map_reserved.userId != null) _g15.setReserved("userId","UserId"); else _g15.h["userId"] = "UserId";
		if(__map_reserved.elnSectionId != null) _g15.setReserved("elnSectionId","ELN_SECTIONID"); else _g15.h["elnSectionId"] = "ELN_SECTIONID";
		if(__map_reserved.mergePrev != null) _g15.setReserved("mergePrev","Merge_Prev"); else _g15.h["mergePrev"] = "Merge_Prev";
		if(__map_reserved.user != null) _g15.setReserved("user","User"); else _g15.h["user"] = "User";
		value14 = _g15;
		if(__map_reserved.fields != null) _g14.setReserved("fields",value14); else _g14.h["fields"] = value14;
		var value15;
		var _g16 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g16.setReserved("schema","icmdb_page_secure"); else _g16.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g16.setReserved("name","V_LABPAGE_ITEM"); else _g16.h["name"] = "V_LABPAGE_ITEM";
		value15 = _g16;
		if(__map_reserved.table_info != null) _g14.setReserved("table_info",value15); else _g14.h["table_info"] = value15;
		var value16;
		var _g17 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g17.setReserved("id",true); else _g17.h["id"] = true;
		value16 = _g17;
		if(__map_reserved.indexes != null) _g14.setReserved("indexes",value16); else _g14.h["indexes"] = value16;
		var value17;
		var _g18 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g18.setReserved("field","id"); else _g18.h["field"] = "id";
		if(__map_reserved.fk_field != null) _g18.setReserved("fk_field","id"); else _g18.h["fk_field"] = "id";
		if(__map_reserved.selector_field != null) _g18.setReserved("selector_field","name"); else _g18.h["selector_field"] = "name";
		var value18;
		var _g19 = new haxe.ds.StringMap();
		if(__map_reserved.LABPAGE_TEXT != null) _g19.setReserved("LABPAGE_TEXT","saturn.core.scarab.LabPageText"); else _g19.h["LABPAGE_TEXT"] = "saturn.core.scarab.LabPageText";
		if(__map_reserved.LABPAGE_EXCEL != null) _g19.setReserved("LABPAGE_EXCEL","saturn.core.scarab.LabPageExcel"); else _g19.h["LABPAGE_EXCEL"] = "saturn.core.scarab.LabPageExcel";
		if(__map_reserved.LABPAGE_IMAGE != null) _g19.setReserved("LABPAGE_IMAGE","saturn.core.scarab.LabPageImage"); else _g19.h["LABPAGE_IMAGE"] = "saturn.core.scarab.LabPageImage";
		value18 = _g19;
		_g18.set("selector_values",value18);
		value17 = _g18;
		if(__map_reserved.polymorphic != null) _g14.setReserved("polymorphic",value17); else _g14.h["polymorphic"] = value17;
		value13 = _g14;
		if(__map_reserved["saturn.core.scarab.LabPageItem"] != null) _g.setReserved("saturn.core.scarab.LabPageItem",value13); else _g.h["saturn.core.scarab.LabPageItem"] = value13;
		var value19;
		var _g20 = new haxe.ds.StringMap();
		var value20;
		var _g21 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g21.setReserved("id","Id"); else _g21.h["id"] = "Id";
		if(__map_reserved.fullName != null) _g21.setReserved("fullName","Full_Name"); else _g21.h["fullName"] = "Full_Name";
		value20 = _g21;
		if(__map_reserved.fields != null) _g20.setReserved("fields",value20); else _g20.h["fields"] = value20;
		var value21;
		var _g22 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g22.setReserved("schema","icmdb_page_secure"); else _g22.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g22.setReserved("name","V_USERS2"); else _g22.h["name"] = "V_USERS2";
		value21 = _g22;
		if(__map_reserved.table_info != null) _g20.setReserved("table_info",value21); else _g20.h["table_info"] = value21;
		var value22;
		var _g23 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g23.setReserved("id",true); else _g23.h["id"] = true;
		value22 = _g23;
		if(__map_reserved.indexes != null) _g20.setReserved("indexes",value22); else _g20.h["indexes"] = value22;
		value19 = _g20;
		if(__map_reserved["saturn.core.scarab.LabPageUser"] != null) _g.setReserved("saturn.core.scarab.LabPageUser",value19); else _g.h["saturn.core.scarab.LabPageUser"] = value19;
		var value23;
		var _g24 = new haxe.ds.StringMap();
		var value24;
		var _g25 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g25.setReserved("id","Id"); else _g25.h["id"] = "Id";
		if(__map_reserved.content != null) _g25.setReserved("content","Content"); else _g25.h["content"] = "Content";
		value24 = _g25;
		if(__map_reserved.fields != null) _g24.setReserved("fields",value24); else _g24.h["fields"] = value24;
		var value25;
		var _g26 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g26.setReserved("schema","icmdb_page_secure"); else _g26.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g26.setReserved("name","V_LABPAGE_TEXT"); else _g26.h["name"] = "V_LABPAGE_TEXT";
		value25 = _g26;
		if(__map_reserved.table_info != null) _g24.setReserved("table_info",value25); else _g24.h["table_info"] = value25;
		var value26;
		var _g27 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g27.setReserved("id",true); else _g27.h["id"] = true;
		value26 = _g27;
		if(__map_reserved.indexes != null) _g24.setReserved("indexes",value26); else _g24.h["indexes"] = value26;
		value23 = _g24;
		if(__map_reserved["saturn.core.scarab.LabPageText"] != null) _g.setReserved("saturn.core.scarab.LabPageText",value23); else _g.h["saturn.core.scarab.LabPageText"] = value23;
		var value27;
		var _g28 = new haxe.ds.StringMap();
		var value28;
		var _g29 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g29.setReserved("id","Id"); else _g29.h["id"] = "Id";
		if(__map_reserved.imageEdit != null) _g29.setReserved("imageEdit","Image_Edit"); else _g29.h["imageEdit"] = "Image_Edit";
		if(__map_reserved.imageAnnot != null) _g29.setReserved("imageAnnot","Image_Annot"); else _g29.h["imageAnnot"] = "Image_Annot";
		if(__map_reserved.vectorized != null) _g29.setReserved("vectorized","Vectorized"); else _g29.h["vectorized"] = "Vectorized";
		if(__map_reserved.elnProperties != null) _g29.setReserved("elnProperties","ELN_PROPERTIES"); else _g29.h["elnProperties"] = "ELN_PROPERTIES";
		if(__map_reserved.annotTexts != null) _g29.setReserved("annotTexts","AnnotTexts"); else _g29.h["annotTexts"] = "AnnotTexts";
		if(__map_reserved.wmf != null) _g29.setReserved("wmf","WMF"); else _g29.h["wmf"] = "WMF";
		value28 = _g29;
		if(__map_reserved.fields != null) _g28.setReserved("fields",value28); else _g28.h["fields"] = value28;
		var value29;
		var _g30 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g30.setReserved("schema","icmdb_page_secure"); else _g30.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g30.setReserved("name","V_LABPAGE_IMAGE"); else _g30.h["name"] = "V_LABPAGE_IMAGE";
		value29 = _g30;
		if(__map_reserved.table_info != null) _g28.setReserved("table_info",value29); else _g28.h["table_info"] = value29;
		var value30;
		var _g31 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g31.setReserved("id",true); else _g31.h["id"] = true;
		value30 = _g31;
		if(__map_reserved.indexes != null) _g28.setReserved("indexes",value30); else _g28.h["indexes"] = value30;
		value27 = _g28;
		if(__map_reserved["saturn.core.scarab.LabPageImage"] != null) _g.setReserved("saturn.core.scarab.LabPageImage",value27); else _g.h["saturn.core.scarab.LabPageImage"] = value27;
		var value31;
		var _g32 = new haxe.ds.StringMap();
		var value32;
		var _g33 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g33.setReserved("id","Id"); else _g33.h["id"] = "Id";
		if(__map_reserved.pdf != null) _g33.setReserved("pdf","PDF"); else _g33.h["pdf"] = "PDF";
		if(__map_reserved.image != null) _g33.setReserved("image","Image"); else _g33.h["image"] = "Image";
		value32 = _g33;
		if(__map_reserved.fields != null) _g32.setReserved("fields",value32); else _g32.h["fields"] = value32;
		var value33;
		var _g34 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g34.setReserved("schema","icmdb_page_secure"); else _g34.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g34.setReserved("name","V_LABPAGE_PDF"); else _g34.h["name"] = "V_LABPAGE_PDF";
		value33 = _g34;
		if(__map_reserved.table_info != null) _g32.setReserved("table_info",value33); else _g32.h["table_info"] = value33;
		var value34;
		var _g35 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g35.setReserved("id",true); else _g35.h["id"] = true;
		value34 = _g35;
		if(__map_reserved.indexes != null) _g32.setReserved("indexes",value34); else _g32.h["indexes"] = value34;
		value31 = _g32;
		if(__map_reserved["saturn.core.scarab.LabPagePdf"] != null) _g.setReserved("saturn.core.scarab.LabPagePdf",value31); else _g.h["saturn.core.scarab.LabPagePdf"] = value31;
		var value35;
		var _g36 = new haxe.ds.StringMap();
		var value36;
		var _g37 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g37.setReserved("id","Id"); else _g37.h["id"] = "Id";
		if(__map_reserved.excel != null) _g37.setReserved("excel","Excel"); else _g37.h["excel"] = "Excel";
		if(__map_reserved.filename != null) _g37.setReserved("filename","Filename"); else _g37.h["filename"] = "Filename";
		if(__map_reserved.html != null) _g37.setReserved("html","Html"); else _g37.h["html"] = "Html";
		if(__map_reserved.htmlFolder != null) _g37.setReserved("htmlFolder","HtmlFolder"); else _g37.h["htmlFolder"] = "HtmlFolder";
		value36 = _g37;
		if(__map_reserved.fields != null) _g36.setReserved("fields",value36); else _g36.h["fields"] = value36;
		var value37;
		var _g38 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g38.setReserved("schema","icmdb_page_secure"); else _g38.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g38.setReserved("name","V_LABPAGE_EXCEL"); else _g38.h["name"] = "V_LABPAGE_EXCEL";
		value37 = _g38;
		if(__map_reserved.table_info != null) _g36.setReserved("table_info",value37); else _g36.h["table_info"] = value37;
		var value38;
		var _g39 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g39.setReserved("id",true); else _g39.h["id"] = true;
		value38 = _g39;
		if(__map_reserved.indexes != null) _g36.setReserved("indexes",value38); else _g36.h["indexes"] = value38;
		value35 = _g36;
		if(__map_reserved["saturn.core.scarab.LabPageExcel"] != null) _g.setReserved("saturn.core.scarab.LabPageExcel",value35); else _g.h["saturn.core.scarab.LabPageExcel"] = value35;
		var value39;
		var _g40 = new haxe.ds.StringMap();
		var value40;
		var _g41 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g41.setReserved("id","Id"); else _g41.h["id"] = "Id";
		if(__map_reserved.displayOrder != null) _g41.setReserved("displayOrder","num"); else _g41.h["displayOrder"] = "num";
		if(__map_reserved.filename != null) _g41.setReserved("filename","Filename"); else _g41.h["filename"] = "Filename";
		if(__map_reserved.content != null) _g41.setReserved("content","Content"); else _g41.h["content"] = "Content";
		if(__map_reserved.modifiedInICMdb != null) _g41.setReserved("modifiedInICMdb","ModifiedInICMdb"); else _g41.h["modifiedInICMdb"] = "ModifiedInICMdb";
		value40 = _g41;
		if(__map_reserved.fields != null) _g40.setReserved("fields",value40); else _g40.h["fields"] = value40;
		var value41;
		var _g42 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g42.setReserved("schema","icmdb_page_secure"); else _g42.h["schema"] = "icmdb_page_secure";
		if(__map_reserved.name != null) _g42.setReserved("name","V_LABPAGE_ATT"); else _g42.h["name"] = "V_LABPAGE_ATT";
		value41 = _g42;
		if(__map_reserved.table_info != null) _g40.setReserved("table_info",value41); else _g40.h["table_info"] = value41;
		var value42;
		var _g43 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g43.setReserved("id",true); else _g43.h["id"] = true;
		if(__map_reserved.displayOrder != null) _g43.setReserved("displayOrder",true); else _g43.h["displayOrder"] = true;
		value42 = _g43;
		if(__map_reserved.indexes != null) _g40.setReserved("indexes",value42); else _g40.h["indexes"] = value42;
		value39 = _g40;
		if(__map_reserved["saturn.core.scarab.LabPageAttachments"] != null) _g.setReserved("saturn.core.scarab.LabPageAttachments",value39); else _g.h["saturn.core.scarab.LabPageAttachments"] = value39;
		var value43;
		var _g44 = new haxe.ds.StringMap();
		var value44;
		var _g45 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g45.setReserved("path","PATH"); else _g45.h["path"] = "PATH";
		if(__map_reserved.content != null) _g45.setReserved("content","CONTENT"); else _g45.h["content"] = "CONTENT";
		value44 = _g45;
		if(__map_reserved.fields != null) _g44.setReserved("fields",value44); else _g44.h["fields"] = value44;
		var value45;
		var _g46 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g46.setReserved("path",true); else _g46.h["path"] = true;
		value45 = _g46;
		if(__map_reserved.indexes != null) _g44.setReserved("indexes",value45); else _g44.h["indexes"] = value45;
		var value46;
		var _g47 = new haxe.ds.StringMap();
		var value47;
		var _g48 = new haxe.ds.StringMap();
		if(__map_reserved["/work"] != null) _g48.setReserved("/work","W:"); else _g48.h["/work"] = "W:";
		if(__map_reserved["/home/share"] != null) _g48.setReserved("/home/share","S:"); else _g48.h["/home/share"] = "S:";
		value47 = _g48;
		_g47.set("windows_conversions",value47);
		var value48;
		var _g49 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g49.setReserved("WORK","^W:[^\\.]+.pdb$"); else _g49.h["WORK"] = "^W:[^\\.]+.pdb$";
		value48 = _g49;
		_g47.set("windows_allowed_paths_regex",value48);
		var value49;
		var _g50 = new haxe.ds.StringMap();
		if(__map_reserved["W:"] != null) _g50.setReserved("W:","/work"); else _g50.h["W:"] = "/work";
		value49 = _g50;
		_g47.set("linux_conversions",value49);
		var value50;
		var _g51 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g51.setReserved("WORK","^/work"); else _g51.h["WORK"] = "^/work";
		value50 = _g51;
		_g47.set("linux_allowed_paths_regex",value50);
		value46 = _g47;
		if(__map_reserved.options != null) _g44.setReserved("options",value46); else _g44.h["options"] = value46;
		value43 = _g44;
		if(__map_reserved["saturn.core.domain.FileProxy"] != null) _g.setReserved("saturn.core.domain.FileProxy",value43); else _g.h["saturn.core.domain.FileProxy"] = value43;
		this.models = _g;
	}
	,__class__: saturn.db.mapping.KIR
};
saturn.db.mapping.KISGC = $hxClasses["saturn.db.mapping.KISGC"] = function() {
	this.buildModels();
};
saturn.db.mapping.KISGC.__name__ = ["saturn","db","mapping","KISGC"];
saturn.db.mapping.KISGC.getNextAvailableId = function(clazz,value,db,cb) {
};
saturn.db.mapping.KISGC.prototype = {
	models: null
	,buildModels: function() {
		var _g = new haxe.ds.StringMap();
		var value;
		var _g1 = new haxe.ds.StringMap();
		var value1;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g2.setReserved("constructId","CONSTRUCTID"); else _g2.h["constructId"] = "CONSTRUCTID";
		if(__map_reserved.id != null) _g2.setReserved("id","PKEY"); else _g2.h["id"] = "PKEY";
		if(__map_reserved.proteinSeq != null) _g2.setReserved("proteinSeq","CONSTRUCTPROTSEQ"); else _g2.h["proteinSeq"] = "CONSTRUCTPROTSEQ";
		if(__map_reserved.proteinSeqNoTag != null) _g2.setReserved("proteinSeqNoTag","CONSTRUCTPROTSEQNOTAG"); else _g2.h["proteinSeqNoTag"] = "CONSTRUCTPROTSEQNOTAG";
		if(__map_reserved.dnaSeq != null) _g2.setReserved("dnaSeq","CONSTRUCTDNASEQ"); else _g2.h["dnaSeq"] = "CONSTRUCTDNASEQ";
		if(__map_reserved.docId != null) _g2.setReserved("docId","ELNEXP"); else _g2.h["docId"] = "ELNEXP";
		if(__map_reserved.vectorId != null) _g2.setReserved("vectorId","SGCVECTOR"); else _g2.h["vectorId"] = "SGCVECTOR";
		if(__map_reserved.alleleId != null) _g2.setReserved("alleleId","SGCDNAINSERT"); else _g2.h["alleleId"] = "SGCDNAINSERT";
		if(__map_reserved.res1Id != null) _g2.setReserved("res1Id","SGCRESTRICTIONENZYME1"); else _g2.h["res1Id"] = "SGCRESTRICTIONENZYME1";
		if(__map_reserved.res2Id != null) _g2.setReserved("res2Id","SGCRESTRICTIONENZYME2"); else _g2.h["res2Id"] = "SGCRESTRICTIONENZYME2";
		if(__map_reserved.constructPlateId != null) _g2.setReserved("constructPlateId","SGCPLATE"); else _g2.h["constructPlateId"] = "SGCPLATE";
		if(__map_reserved.wellId != null) _g2.setReserved("wellId","PLATEWELL"); else _g2.h["wellId"] = "PLATEWELL";
		if(__map_reserved.expectedMass != null) _g2.setReserved("expectedMass","EXPECTEDMASS"); else _g2.h["expectedMass"] = "EXPECTEDMASS";
		if(__map_reserved.expectedMassNoTag != null) _g2.setReserved("expectedMassNoTag","EXPECTEDMASSNOTAG"); else _g2.h["expectedMassNoTag"] = "EXPECTEDMASSNOTAG";
		if(__map_reserved.status != null) _g2.setReserved("status","STATUS"); else _g2.h["status"] = "STATUS";
		if(__map_reserved.location != null) _g2.setReserved("location","SGCLOCATION"); else _g2.h["location"] = "SGCLOCATION";
		if(__map_reserved.elnId != null) _g2.setReserved("elnId","ELNEXP"); else _g2.h["elnId"] = "ELNEXP";
		if(__map_reserved.constructComments != null) _g2.setReserved("constructComments","COMMENTS"); else _g2.h["constructComments"] = "COMMENTS";
		if(__map_reserved.person != null) _g2.setReserved("person","PERSON"); else _g2.h["person"] = "PERSON";
		value1 = _g2;
		if(__map_reserved.fields != null) _g1.setReserved("fields",value1); else _g1.h["fields"] = value1;
		var value2;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.status != null) _g3.setReserved("status","In progress"); else _g3.h["status"] = "In progress";
		value2 = _g3;
		if(__map_reserved.defaults != null) _g1.setReserved("defaults",value2); else _g1.h["defaults"] = value2;
		var value3;
		var _g4 = new haxe.ds.StringMap();
		if(__map_reserved.PERSON != null) _g4.setReserved("PERSON","insert.username"); else _g4.h["PERSON"] = "insert.username";
		value3 = _g4;
		if(__map_reserved.auto_functions != null) _g1.setReserved("auto_functions",value3); else _g1.h["auto_functions"] = value3;
		var value4;
		var _g5 = new haxe.ds.StringMap();
		if(__map_reserved.wellId != null) _g5.setReserved("wellId","1"); else _g5.h["wellId"] = "1";
		if(__map_reserved.constructPlateId != null) _g5.setReserved("constructPlateId","1"); else _g5.h["constructPlateId"] = "1";
		if(__map_reserved.constructId != null) _g5.setReserved("constructId","1"); else _g5.h["constructId"] = "1";
		if(__map_reserved.alleleId != null) _g5.setReserved("alleleId","1"); else _g5.h["alleleId"] = "1";
		if(__map_reserved.vectorId != null) _g5.setReserved("vectorId","1"); else _g5.h["vectorId"] = "1";
		if(__map_reserved.elnId != null) _g5.setReserved("elnId","1"); else _g5.h["elnId"] = "1";
		value4 = _g5;
		if(__map_reserved.required != null) _g1.setReserved("required",value4); else _g1.h["required"] = value4;
		var value5;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g6.setReserved("constructId",false); else _g6.h["constructId"] = false;
		if(__map_reserved.id != null) _g6.setReserved("id",true); else _g6.h["id"] = true;
		value5 = _g6;
		if(__map_reserved.indexes != null) _g1.setReserved("indexes",value5); else _g1.h["indexes"] = value5;
		var value6;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved["Construct ID"] != null) _g7.setReserved("Construct ID","constructId"); else _g7.h["Construct ID"] = "constructId";
		if(__map_reserved["Construct Plate"] != null) _g7.setReserved("Construct Plate","constructPlate.plateName"); else _g7.h["Construct Plate"] = "constructPlate.plateName";
		if(__map_reserved["Well ID"] != null) _g7.setReserved("Well ID","wellId"); else _g7.h["Well ID"] = "wellId";
		if(__map_reserved["Vector ID"] != null) _g7.setReserved("Vector ID","vector.vectorId"); else _g7.h["Vector ID"] = "vector.vectorId";
		if(__map_reserved["Allele ID"] != null) _g7.setReserved("Allele ID","allele.alleleId"); else _g7.h["Allele ID"] = "allele.alleleId";
		if(__map_reserved.Status != null) _g7.setReserved("Status","status"); else _g7.h["Status"] = "status";
		if(__map_reserved["Protein Sequence"] != null) _g7.setReserved("Protein Sequence","proteinSeq"); else _g7.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved["Expected Mass"] != null) _g7.setReserved("Expected Mass","expectedMass"); else _g7.h["Expected Mass"] = "expectedMass";
		if(__map_reserved["Restriction Site 1"] != null) _g7.setReserved("Restriction Site 1","res1.enzymeName"); else _g7.h["Restriction Site 1"] = "res1.enzymeName";
		if(__map_reserved["Restriction Site 2"] != null) _g7.setReserved("Restriction Site 2","res2.enzymeName"); else _g7.h["Restriction Site 2"] = "res2.enzymeName";
		if(__map_reserved["Protein Sequence (No Tag)"] != null) _g7.setReserved("Protein Sequence (No Tag)","proteinSeqNoTag"); else _g7.h["Protein Sequence (No Tag)"] = "proteinSeqNoTag";
		if(__map_reserved["Expected Mass (No Tag)"] != null) _g7.setReserved("Expected Mass (No Tag)","expectedMassNoTag"); else _g7.h["Expected Mass (No Tag)"] = "expectedMassNoTag";
		if(__map_reserved["Construct DNA Sequence"] != null) _g7.setReserved("Construct DNA Sequence","dnaSeq"); else _g7.h["Construct DNA Sequence"] = "dnaSeq";
		if(__map_reserved.Location != null) _g7.setReserved("Location","location"); else _g7.h["Location"] = "location";
		if(__map_reserved["ELN ID"] != null) _g7.setReserved("ELN ID","elnId"); else _g7.h["ELN ID"] = "elnId";
		if(__map_reserved["Construct Comments"] != null) _g7.setReserved("Construct Comments","constructComments"); else _g7.h["Construct Comments"] = "constructComments";
		if(__map_reserved.Creator != null) _g7.setReserved("Creator","person"); else _g7.h["Creator"] = "person";
		if(__map_reserved["Construct Start"] != null) _g7.setReserved("Construct Start","constructStart"); else _g7.h["Construct Start"] = "constructStart";
		if(__map_reserved["Construct Stop"] != null) _g7.setReserved("Construct Stop","constructStop"); else _g7.h["Construct Stop"] = "constructStop";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g7.setReserved("__HIDDEN__PKEY__","id"); else _g7.h["__HIDDEN__PKEY__"] = "id";
		value6 = _g7;
		if(__map_reserved.model != null) _g1.setReserved("model",value6); else _g1.h["model"] = value6;
		var value7;
		var _g8 = new haxe.ds.StringMap();
		var value8;
		var _g9 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g9.setReserved("field","alleleId"); else _g9.h["field"] = "alleleId";
		if(__map_reserved["class"] != null) _g9.setReserved("class","saturn.core.domain.SgcAllele"); else _g9.h["class"] = "saturn.core.domain.SgcAllele";
		if(__map_reserved.fk_field != null) _g9.setReserved("fk_field","alleleId"); else _g9.h["fk_field"] = "alleleId";
		value8 = _g9;
		_g8.set("allele",value8);
		var value9;
		var _g10 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g10.setReserved("field","vectorId"); else _g10.h["field"] = "vectorId";
		if(__map_reserved["class"] != null) _g10.setReserved("class","saturn.core.domain.SgcVector"); else _g10.h["class"] = "saturn.core.domain.SgcVector";
		if(__map_reserved.fk_field != null) _g10.setReserved("fk_field","vectorId"); else _g10.h["fk_field"] = "vectorId";
		value9 = _g10;
		_g8.set("vector",value9);
		var value10;
		var _g11 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g11.setReserved("field","res1Id"); else _g11.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g11.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g11.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g11.setReserved("fk_field","enzymeName"); else _g11.h["fk_field"] = "enzymeName";
		value10 = _g11;
		_g8.set("res1",value10);
		var value11;
		var _g12 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g12.setReserved("field","res2Id"); else _g12.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g12.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g12.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g12.setReserved("fk_field","enzymeName"); else _g12.h["fk_field"] = "enzymeName";
		value11 = _g12;
		_g8.set("res2",value11);
		var value12;
		var _g13 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g13.setReserved("field","constructPlateId"); else _g13.h["field"] = "constructPlateId";
		if(__map_reserved["class"] != null) _g13.setReserved("class","saturn.core.domain.SgcConstructPlate"); else _g13.h["class"] = "saturn.core.domain.SgcConstructPlate";
		if(__map_reserved.fk_field != null) _g13.setReserved("fk_field","plateName"); else _g13.h["fk_field"] = "plateName";
		value12 = _g13;
		_g8.set("constructPlate",value12);
		value7 = _g8;
		if(__map_reserved["fields.synthetic"] != null) _g1.setReserved("fields.synthetic",value7); else _g1.h["fields.synthetic"] = value7;
		var value13;
		var _g14 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g14.setReserved("schema","SGC"); else _g14.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g14.setReserved("name","CONSTRUCT"); else _g14.h["name"] = "CONSTRUCT";
		value13 = _g14;
		if(__map_reserved.table_info != null) _g1.setReserved("table_info",value13); else _g1.h["table_info"] = value13;
		var value14;
		var _g15 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g15.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g15.h["saturn.client.programs.DNASequenceEditor"] = true;
		value14 = _g15;
		if(__map_reserved.programs != null) _g1.setReserved("programs",value14); else _g1.h["programs"] = value14;
		var value15;
		var _g16 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g16.setReserved("constructId",true); else _g16.h["constructId"] = true;
		value15 = _g16;
		if(__map_reserved.search != null) _g1.setReserved("search",value15); else _g1.h["search"] = value15;
		var value16;
		var _g17 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g17.setReserved("alias","Construct"); else _g17.h["alias"] = "Construct";
		if(__map_reserved.icon != null) _g17.setReserved("icon","dna_conical_16.png"); else _g17.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g17.setReserved("auto_activate","3"); else _g17.h["auto_activate"] = "3";
		value16 = _g17;
		if(__map_reserved.options != null) _g1.setReserved("options",value16); else _g1.h["options"] = value16;
		value = _g1;
		if(__map_reserved["saturn.core.domain.SgcConstruct"] != null) _g.setReserved("saturn.core.domain.SgcConstruct",value); else _g.h["saturn.core.domain.SgcConstruct"] = value;
		var value17;
		var _g18 = new haxe.ds.StringMap();
		var value18;
		var _g19 = new haxe.ds.StringMap();
		if(__map_reserved.constructPkey != null) _g19.setReserved("constructPkey","SGCCONSTRUCT_PKEY"); else _g19.h["constructPkey"] = "SGCCONSTRUCT_PKEY";
		if(__map_reserved.status != null) _g19.setReserved("status","STATUS"); else _g19.h["status"] = "STATUS";
		value18 = _g19;
		if(__map_reserved.fields != null) _g18.setReserved("fields",value18); else _g18.h["fields"] = value18;
		var value19;
		var _g20 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g20.setReserved("schema","SGC"); else _g20.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g20.setReserved("name","CONSTR_STATUS_SNAPSHOT"); else _g20.h["name"] = "CONSTR_STATUS_SNAPSHOT";
		value19 = _g20;
		if(__map_reserved.table_info != null) _g18.setReserved("table_info",value19); else _g18.h["table_info"] = value19;
		var value20;
		var _g21 = new haxe.ds.StringMap();
		if(__map_reserved.constructPkey != null) _g21.setReserved("constructPkey",true); else _g21.h["constructPkey"] = true;
		value20 = _g21;
		if(__map_reserved.indexes != null) _g18.setReserved("indexes",value20); else _g18.h["indexes"] = value20;
		value17 = _g18;
		if(__map_reserved["saturn.core.domain.SgcConstructStatus"] != null) _g.setReserved("saturn.core.domain.SgcConstructStatus",value17); else _g.h["saturn.core.domain.SgcConstructStatus"] = value17;
		var value21;
		var _g22 = new haxe.ds.StringMap();
		var value22;
		var _g23 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g23.setReserved("alleleId","DNAINSERTID"); else _g23.h["alleleId"] = "DNAINSERTID";
		if(__map_reserved.allelePlateId != null) _g23.setReserved("allelePlateId","SGCPLATE"); else _g23.h["allelePlateId"] = "SGCPLATE";
		if(__map_reserved.id != null) _g23.setReserved("id","PKEY"); else _g23.h["id"] = "PKEY";
		if(__map_reserved.entryCloneId != null) _g23.setReserved("entryCloneId","SGCENTRYCLONE"); else _g23.h["entryCloneId"] = "SGCENTRYCLONE";
		if(__map_reserved.forwardPrimerId != null) _g23.setReserved("forwardPrimerId","SGCPRIMER"); else _g23.h["forwardPrimerId"] = "SGCPRIMER";
		if(__map_reserved.reversePrimerId != null) _g23.setReserved("reversePrimerId","SGCPRIMERREV"); else _g23.h["reversePrimerId"] = "SGCPRIMERREV";
		if(__map_reserved.dnaSeq != null) _g23.setReserved("dnaSeq","DNAINSERTSEQUENCE"); else _g23.h["dnaSeq"] = "DNAINSERTSEQUENCE";
		if(__map_reserved.proteinSeq != null) _g23.setReserved("proteinSeq","DNAINSERTPROTSEQ"); else _g23.h["proteinSeq"] = "DNAINSERTPROTSEQ";
		if(__map_reserved.status != null) _g23.setReserved("status","DNAINSERTSTATUS"); else _g23.h["status"] = "DNAINSERTSTATUS";
		if(__map_reserved.comments != null) _g23.setReserved("comments","COMMENTS"); else _g23.h["comments"] = "COMMENTS";
		if(__map_reserved.elnId != null) _g23.setReserved("elnId","ELNEXP"); else _g23.h["elnId"] = "ELNEXP";
		if(__map_reserved.dateStamp != null) _g23.setReserved("dateStamp","DATESTAMP"); else _g23.h["dateStamp"] = "DATESTAMP";
		if(__map_reserved.person != null) _g23.setReserved("person","PERSON"); else _g23.h["person"] = "PERSON";
		if(__map_reserved.plateWell != null) _g23.setReserved("plateWell","PLATEWELL"); else _g23.h["plateWell"] = "PLATEWELL";
		if(__map_reserved.dnaSeqLen != null) _g23.setReserved("dnaSeqLen","DNAINSERTSEQLENGTH"); else _g23.h["dnaSeqLen"] = "DNAINSERTSEQLENGTH";
		if(__map_reserved.domainSummary != null) _g23.setReserved("domainSummary","DOMAINSUMMARY"); else _g23.h["domainSummary"] = "DOMAINSUMMARY";
		if(__map_reserved.domainStartDelta != null) _g23.setReserved("domainStartDelta","DOMAINSTARTDELTA"); else _g23.h["domainStartDelta"] = "DOMAINSTARTDELTA";
		if(__map_reserved.domainStopDelta != null) _g23.setReserved("domainStopDelta","DOMAINSTOPDELTA"); else _g23.h["domainStopDelta"] = "DOMAINSTOPDELTA";
		if(__map_reserved.containsPharmaDomain != null) _g23.setReserved("containsPharmaDomain","CONTAINSPHARMADOMAIN"); else _g23.h["containsPharmaDomain"] = "CONTAINSPHARMADOMAIN";
		if(__map_reserved.domainSummaryLong != null) _g23.setReserved("domainSummaryLong","DOMAINSUMMARYLONG"); else _g23.h["domainSummaryLong"] = "DOMAINSUMMARYLONG";
		value22 = _g23;
		if(__map_reserved.fields != null) _g22.setReserved("fields",value22); else _g22.h["fields"] = value22;
		var value23;
		var _g24 = new haxe.ds.StringMap();
		if(__map_reserved.status != null) _g24.setReserved("status","In process"); else _g24.h["status"] = "In process";
		value23 = _g24;
		if(__map_reserved.defaults != null) _g22.setReserved("defaults",value23); else _g22.h["defaults"] = value23;
		var value24;
		var _g25 = new haxe.ds.StringMap();
		if(__map_reserved["Allele ID"] != null) _g25.setReserved("Allele ID","alleleId"); else _g25.h["Allele ID"] = "alleleId";
		if(__map_reserved.Plate != null) _g25.setReserved("Plate","plate.plateName"); else _g25.h["Plate"] = "plate.plateName";
		if(__map_reserved["Entry Clone ID"] != null) _g25.setReserved("Entry Clone ID","entryClone.entryCloneId"); else _g25.h["Entry Clone ID"] = "entryClone.entryCloneId";
		if(__map_reserved["Forward Primer ID"] != null) _g25.setReserved("Forward Primer ID","forwardPrimer.primerId"); else _g25.h["Forward Primer ID"] = "forwardPrimer.primerId";
		if(__map_reserved["Reverse Primer ID"] != null) _g25.setReserved("Reverse Primer ID","reversePrimer.primerId"); else _g25.h["Reverse Primer ID"] = "reversePrimer.primerId";
		if(__map_reserved["DNA Sequence"] != null) _g25.setReserved("DNA Sequence","dnaSeq"); else _g25.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved["Protein Sequence"] != null) _g25.setReserved("Protein Sequence","proteinSeq"); else _g25.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.Status != null) _g25.setReserved("Status","status"); else _g25.h["Status"] = "status";
		if(__map_reserved.Location != null) _g25.setReserved("Location","location"); else _g25.h["Location"] = "location";
		if(__map_reserved.Comments != null) _g25.setReserved("Comments","comments"); else _g25.h["Comments"] = "comments";
		if(__map_reserved["ELN ID"] != null) _g25.setReserved("ELN ID","elnId"); else _g25.h["ELN ID"] = "elnId";
		if(__map_reserved["Date Record"] != null) _g25.setReserved("Date Record","dateStamp"); else _g25.h["Date Record"] = "dateStamp";
		if(__map_reserved.Person != null) _g25.setReserved("Person","person"); else _g25.h["Person"] = "person";
		if(__map_reserved["Plate Well"] != null) _g25.setReserved("Plate Well","plateWell"); else _g25.h["Plate Well"] = "plateWell";
		if(__map_reserved["DNA Length"] != null) _g25.setReserved("DNA Length","dnaSeqLen"); else _g25.h["DNA Length"] = "dnaSeqLen";
		if(__map_reserved.Complex != null) _g25.setReserved("Complex","complex"); else _g25.h["Complex"] = "complex";
		if(__map_reserved["Domain Summary"] != null) _g25.setReserved("Domain Summary","domainSummary"); else _g25.h["Domain Summary"] = "domainSummary";
		if(__map_reserved["Domain  Start Delta"] != null) _g25.setReserved("Domain  Start Delta","domainStartDelta"); else _g25.h["Domain  Start Delta"] = "domainStartDelta";
		if(__map_reserved["Domain Stop Delta"] != null) _g25.setReserved("Domain Stop Delta","domainStopDelta"); else _g25.h["Domain Stop Delta"] = "domainStopDelta";
		if(__map_reserved["Contains Pharma Domain"] != null) _g25.setReserved("Contains Pharma Domain","containsPharmaDomain"); else _g25.h["Contains Pharma Domain"] = "containsPharmaDomain";
		if(__map_reserved["Domain Summary Long"] != null) _g25.setReserved("Domain Summary Long","domainSummaryLong"); else _g25.h["Domain Summary Long"] = "domainSummaryLong";
		if(__map_reserved["IMP PI"] != null) _g25.setReserved("IMP PI","impPI"); else _g25.h["IMP PI"] = "impPI";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g25.setReserved("__HIDDEN__PKEY__","id"); else _g25.h["__HIDDEN__PKEY__"] = "id";
		value24 = _g25;
		if(__map_reserved.model != null) _g22.setReserved("model",value24); else _g22.h["model"] = value24;
		var value25;
		var _g26 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g26.setReserved("alleleId",false); else _g26.h["alleleId"] = false;
		if(__map_reserved.id != null) _g26.setReserved("id",true); else _g26.h["id"] = true;
		value25 = _g26;
		if(__map_reserved.indexes != null) _g22.setReserved("indexes",value25); else _g22.h["indexes"] = value25;
		var value26;
		var _g27 = new haxe.ds.StringMap();
		var value27;
		var _g28 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g28.setReserved("field","entryCloneId"); else _g28.h["field"] = "entryCloneId";
		if(__map_reserved["class"] != null) _g28.setReserved("class","saturn.core.domain.SgcEntryClone"); else _g28.h["class"] = "saturn.core.domain.SgcEntryClone";
		if(__map_reserved.fk_field != null) _g28.setReserved("fk_field","entryCloneId"); else _g28.h["fk_field"] = "entryCloneId";
		value27 = _g28;
		_g27.set("entryClone",value27);
		var value28;
		var _g29 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g29.setReserved("field","forwardPrimerId"); else _g29.h["field"] = "forwardPrimerId";
		if(__map_reserved["class"] != null) _g29.setReserved("class","saturn.core.domain.SgcForwardPrimer"); else _g29.h["class"] = "saturn.core.domain.SgcForwardPrimer";
		if(__map_reserved.fk_field != null) _g29.setReserved("fk_field","primerId"); else _g29.h["fk_field"] = "primerId";
		value28 = _g29;
		_g27.set("forwardPrimer",value28);
		var value29;
		var _g30 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g30.setReserved("field","reversePrimerId"); else _g30.h["field"] = "reversePrimerId";
		if(__map_reserved["class"] != null) _g30.setReserved("class","saturn.core.domain.SgcReversePrimer"); else _g30.h["class"] = "saturn.core.domain.SgcReversePrimer";
		if(__map_reserved.fk_field != null) _g30.setReserved("fk_field","primerId"); else _g30.h["fk_field"] = "primerId";
		value29 = _g30;
		_g27.set("reversePrimer",value29);
		var value30;
		var _g31 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g31.setReserved("field","allelePlateId"); else _g31.h["field"] = "allelePlateId";
		if(__map_reserved["class"] != null) _g31.setReserved("class","saturn.core.domain.SgcAllelePlate"); else _g31.h["class"] = "saturn.core.domain.SgcAllelePlate";
		if(__map_reserved.fk_field != null) _g31.setReserved("fk_field","plateName"); else _g31.h["fk_field"] = "plateName";
		value30 = _g31;
		_g27.set("plate",value30);
		value26 = _g27;
		if(__map_reserved["fields.synthetic"] != null) _g22.setReserved("fields.synthetic",value26); else _g22.h["fields.synthetic"] = value26;
		var value31;
		var _g32 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g32.setReserved("schema","SGC"); else _g32.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g32.setReserved("name","DNAINSERT"); else _g32.h["name"] = "DNAINSERT";
		value31 = _g32;
		if(__map_reserved.table_info != null) _g22.setReserved("table_info",value31); else _g22.h["table_info"] = value31;
		var value32;
		var _g33 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g33.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g33.h["saturn.client.programs.DNASequenceEditor"] = true;
		value32 = _g33;
		if(__map_reserved.programs != null) _g22.setReserved("programs",value32); else _g22.h["programs"] = value32;
		var value33;
		var _g34 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g34.setReserved("alleleId",true); else _g34.h["alleleId"] = true;
		value33 = _g34;
		if(__map_reserved.search != null) _g22.setReserved("search",value33); else _g22.h["search"] = value33;
		var value34;
		var _g35 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g35.setReserved("alias","Allele"); else _g35.h["alias"] = "Allele";
		if(__map_reserved.icon != null) _g35.setReserved("icon","dna_conical_16.png"); else _g35.h["icon"] = "dna_conical_16.png";
		value34 = _g35;
		if(__map_reserved.options != null) _g22.setReserved("options",value34); else _g22.h["options"] = value34;
		value21 = _g22;
		if(__map_reserved["saturn.core.domain.SgcAllele"] != null) _g.setReserved("saturn.core.domain.SgcAllele",value21); else _g.h["saturn.core.domain.SgcAllele"] = value21;
		var value35;
		var _g36 = new haxe.ds.StringMap();
		var value36;
		var _g37 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g37.setReserved("entryCloneId","ENTRYCLONEID"); else _g37.h["entryCloneId"] = "ENTRYCLONEID";
		if(__map_reserved.id != null) _g37.setReserved("id","PKEY"); else _g37.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g37.setReserved("dnaSeq","DNARAWSEQUENCE"); else _g37.h["dnaSeq"] = "DNARAWSEQUENCE";
		if(__map_reserved.targetId != null) _g37.setReserved("targetId","SGCTARGET"); else _g37.h["targetId"] = "SGCTARGET";
		if(__map_reserved.seqSource != null) _g37.setReserved("seqSource","SEQSOURCE"); else _g37.h["seqSource"] = "SEQSOURCE";
		if(__map_reserved.sourceId != null) _g37.setReserved("sourceId","SUPPLIERID"); else _g37.h["sourceId"] = "SUPPLIERID";
		if(__map_reserved.sequenceConfirmed != null) _g37.setReserved("sequenceConfirmed","SEQUENCECONFIRMED"); else _g37.h["sequenceConfirmed"] = "SEQUENCECONFIRMED";
		value36 = _g37;
		if(__map_reserved.fields != null) _g36.setReserved("fields",value36); else _g36.h["fields"] = value36;
		var value37;
		var _g38 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g38.setReserved("entryCloneId",false); else _g38.h["entryCloneId"] = false;
		if(__map_reserved.id != null) _g38.setReserved("id",true); else _g38.h["id"] = true;
		value37 = _g38;
		if(__map_reserved.indexes != null) _g36.setReserved("indexes",value37); else _g36.h["indexes"] = value37;
		var value38;
		var _g39 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g39.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g39.h["saturn.client.programs.DNASequenceEditor"] = true;
		value38 = _g39;
		if(__map_reserved.programs != null) _g36.setReserved("programs",value38); else _g36.h["programs"] = value38;
		var value39;
		var _g40 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g40.setReserved("entryCloneId",true); else _g40.h["entryCloneId"] = true;
		value39 = _g40;
		if(__map_reserved.search != null) _g36.setReserved("search",value39); else _g36.h["search"] = value39;
		var value40;
		var _g41 = new haxe.ds.StringMap();
		var value41;
		var _g42 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g42.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g42.h["saturn.client.programs.DNASequenceEditor"] = true;
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g42.setReserved("saturn.client.programs.ProteinSequenceEditor",true); else _g42.h["saturn.client.programs.ProteinSequenceEditor"] = true;
		value41 = _g42;
		_g41.set("canSave",value41);
		if(__map_reserved.alias != null) _g41.setReserved("alias","Entry Clone"); else _g41.h["alias"] = "Entry Clone";
		if(__map_reserved.icon != null) _g41.setReserved("icon","dna_conical_16.png"); else _g41.h["icon"] = "dna_conical_16.png";
		var value42;
		var _g43 = new haxe.ds.StringMap();
		var value43;
		var _g44 = new haxe.ds.StringMap();
		var value44;
		var _g45 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g45.setReserved("user_suffix","Translation"); else _g45.h["user_suffix"] = "Translation";
		if(__map_reserved["function"] != null) _g45.setReserved("function","saturn.core.domain.SgcEntryClone.loadTranslation"); else _g45.h["function"] = "saturn.core.domain.SgcEntryClone.loadTranslation";
		if(__map_reserved.icon != null) _g45.setReserved("icon","structure_16.png"); else _g45.h["icon"] = "structure_16.png";
		value44 = _g45;
		if(__map_reserved.translation != null) _g44.setReserved("translation",value44); else _g44.h["translation"] = value44;
		value43 = _g44;
		if(__map_reserved.search_bar != null) _g43.setReserved("search_bar",value43); else _g43.h["search_bar"] = value43;
		value42 = _g43;
		_g41.set("actions",value42);
		value40 = _g41;
		if(__map_reserved.options != null) _g36.setReserved("options",value40); else _g36.h["options"] = value40;
		var value45;
		var _g46 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g46.setReserved("schema","SGC"); else _g46.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g46.setReserved("name","ENTRYCLONE"); else _g46.h["name"] = "ENTRYCLONE";
		value45 = _g46;
		if(__map_reserved.table_info != null) _g36.setReserved("table_info",value45); else _g36.h["table_info"] = value45;
		var value46;
		var _g47 = new haxe.ds.StringMap();
		if(__map_reserved["Entry Clone ID"] != null) _g47.setReserved("Entry Clone ID","entryCloneId"); else _g47.h["Entry Clone ID"] = "entryCloneId";
		value46 = _g47;
		if(__map_reserved.model != null) _g36.setReserved("model",value46); else _g36.h["model"] = value46;
		var value47;
		var _g48 = new haxe.ds.StringMap();
		var value48;
		var _g49 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g49.setReserved("field","targetId"); else _g49.h["field"] = "targetId";
		if(__map_reserved["class"] != null) _g49.setReserved("class","saturn.core.domain.SgcTarget"); else _g49.h["class"] = "saturn.core.domain.SgcTarget";
		if(__map_reserved.fk_field != null) _g49.setReserved("fk_field","targetId"); else _g49.h["fk_field"] = "targetId";
		value48 = _g49;
		_g48.set("target",value48);
		value47 = _g48;
		if(__map_reserved["fields.synthetic"] != null) _g36.setReserved("fields.synthetic",value47); else _g36.h["fields.synthetic"] = value47;
		value35 = _g36;
		if(__map_reserved["saturn.core.domain.SgcEntryClone"] != null) _g.setReserved("saturn.core.domain.SgcEntryClone",value35); else _g.h["saturn.core.domain.SgcEntryClone"] = value35;
		var value49;
		var _g50 = new haxe.ds.StringMap();
		var value50;
		var _g51 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g51.setReserved("enzymeName","RESTRICTIONENZYMENAME"); else _g51.h["enzymeName"] = "RESTRICTIONENZYMENAME";
		if(__map_reserved.cutSequence != null) _g51.setReserved("cutSequence","RESTRICTIONENZYMESEQUENCERAW"); else _g51.h["cutSequence"] = "RESTRICTIONENZYMESEQUENCERAW";
		if(__map_reserved.id != null) _g51.setReserved("id","PKEY"); else _g51.h["id"] = "PKEY";
		value50 = _g51;
		if(__map_reserved.fields != null) _g50.setReserved("fields",value50); else _g50.h["fields"] = value50;
		var value51;
		var _g52 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g52.setReserved("enzymeName",false); else _g52.h["enzymeName"] = false;
		if(__map_reserved.id != null) _g52.setReserved("id",true); else _g52.h["id"] = true;
		value51 = _g52;
		if(__map_reserved.indexes != null) _g50.setReserved("indexes",value51); else _g50.h["indexes"] = value51;
		var value52;
		var _g53 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g53.setReserved("schema","SGC"); else _g53.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g53.setReserved("name","RESTRICTIONENZYME"); else _g53.h["name"] = "RESTRICTIONENZYME";
		value52 = _g53;
		if(__map_reserved.table_info != null) _g50.setReserved("table_info",value52); else _g50.h["table_info"] = value52;
		var value53;
		var _g54 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g54.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g54.h["saturn.client.programs.DNASequenceEditor"] = true;
		value53 = _g54;
		if(__map_reserved.programs != null) _g50.setReserved("programs",value53); else _g50.h["programs"] = value53;
		var value54;
		var _g55 = new haxe.ds.StringMap();
		if(__map_reserved["Enzyme Name"] != null) _g55.setReserved("Enzyme Name","enzymeName"); else _g55.h["Enzyme Name"] = "enzymeName";
		value54 = _g55;
		if(__map_reserved.model != null) _g50.setReserved("model",value54); else _g50.h["model"] = value54;
		var value55;
		var _g56 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g56.setReserved("alias","Restriction site"); else _g56.h["alias"] = "Restriction site";
		value55 = _g56;
		if(__map_reserved.options != null) _g50.setReserved("options",value55); else _g50.h["options"] = value55;
		var value56;
		var _g57 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g57.setReserved("enzymeName",null); else _g57.h["enzymeName"] = null;
		value56 = _g57;
		if(__map_reserved.search != null) _g50.setReserved("search",value56); else _g50.h["search"] = value56;
		value49 = _g50;
		if(__map_reserved["saturn.core.domain.SgcRestrictionSite"] != null) _g.setReserved("saturn.core.domain.SgcRestrictionSite",value49); else _g.h["saturn.core.domain.SgcRestrictionSite"] = value49;
		var value57;
		var _g58 = new haxe.ds.StringMap();
		var value58;
		var _g59 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g59.setReserved("vectorId","VECTORNAME"); else _g59.h["vectorId"] = "VECTORNAME";
		if(__map_reserved.id != null) _g59.setReserved("id","PKEY"); else _g59.h["id"] = "PKEY";
		if(__map_reserved.sequence != null) _g59.setReserved("sequence","VECTORSEQUENCERAW"); else _g59.h["sequence"] = "VECTORSEQUENCERAW";
		if(__map_reserved.vectorComments != null) _g59.setReserved("vectorComments","VECTORCOMMENTS"); else _g59.h["vectorComments"] = "VECTORCOMMENTS";
		if(__map_reserved.proteaseName != null) _g59.setReserved("proteaseName","PROTEASENAME"); else _g59.h["proteaseName"] = "PROTEASENAME";
		if(__map_reserved.proteaseCutSequence != null) _g59.setReserved("proteaseCutSequence","PROTEASECUTSEQUENCE"); else _g59.h["proteaseCutSequence"] = "PROTEASECUTSEQUENCE";
		if(__map_reserved.proteaseProduct != null) _g59.setReserved("proteaseProduct","PROTEASEPRODUCT"); else _g59.h["proteaseProduct"] = "PROTEASEPRODUCT";
		if(__map_reserved.antibiotic != null) _g59.setReserved("antibiotic","SGCANTIBIOTIC"); else _g59.h["antibiotic"] = "SGCANTIBIOTIC";
		if(__map_reserved.organism != null) _g59.setReserved("organism","SGCORGANISM"); else _g59.h["organism"] = "SGCORGANISM";
		if(__map_reserved.res1Id != null) _g59.setReserved("res1Id","SGCRESTRICTENZ1"); else _g59.h["res1Id"] = "SGCRESTRICTENZ1";
		if(__map_reserved.res2Id != null) _g59.setReserved("res2Id","SGCRESTRICTENZ2"); else _g59.h["res2Id"] = "SGCRESTRICTENZ2";
		if(__map_reserved.requiredForwardExtension != null) _g59.setReserved("requiredForwardExtension","REQUIRED_EXTENSION_FORWARD"); else _g59.h["requiredForwardExtension"] = "REQUIRED_EXTENSION_FORWARD";
		if(__map_reserved.requiredReverseExtension != null) _g59.setReserved("requiredReverseExtension","REQUIRED_EXTENSION_REVERSE"); else _g59.h["requiredReverseExtension"] = "REQUIRED_EXTENSION_REVERSE";
		value58 = _g59;
		if(__map_reserved.fields != null) _g58.setReserved("fields",value58); else _g58.h["fields"] = value58;
		var value59;
		var _g60 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g60.setReserved("vectorId",null); else _g60.h["vectorId"] = null;
		value59 = _g60;
		if(__map_reserved.search != null) _g58.setReserved("search",value59); else _g58.h["search"] = value59;
		var value60;
		var _g61 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g61.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g61.h["saturn.client.programs.DNASequenceEditor"] = true;
		value60 = _g61;
		if(__map_reserved.programs != null) _g58.setReserved("programs",value60); else _g58.h["programs"] = value60;
		var value61;
		var _g62 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g62.setReserved("vectorId",false); else _g62.h["vectorId"] = false;
		if(__map_reserved.id != null) _g62.setReserved("id",true); else _g62.h["id"] = true;
		value61 = _g62;
		if(__map_reserved.indexes != null) _g58.setReserved("indexes",value61); else _g58.h["indexes"] = value61;
		var value62;
		var _g63 = new haxe.ds.StringMap();
		var value63;
		var _g64 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g64.setReserved("field","res1Id"); else _g64.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g64.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g64.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g64.setReserved("fk_field","enzymeName"); else _g64.h["fk_field"] = "enzymeName";
		value63 = _g64;
		_g63.set("res1",value63);
		var value64;
		var _g65 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g65.setReserved("field","res2Id"); else _g65.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g65.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g65.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g65.setReserved("fk_field","enzymeName"); else _g65.h["fk_field"] = "enzymeName";
		value64 = _g65;
		_g63.set("res2",value64);
		value62 = _g63;
		if(__map_reserved["fields.synthetic"] != null) _g58.setReserved("fields.synthetic",value62); else _g58.h["fields.synthetic"] = value62;
		var value65;
		var _g66 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g66.setReserved("schema","SGC"); else _g66.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g66.setReserved("name","VECTOR"); else _g66.h["name"] = "VECTOR";
		value65 = _g66;
		if(__map_reserved.table_info != null) _g58.setReserved("table_info",value65); else _g58.h["table_info"] = value65;
		var value66;
		var _g67 = new haxe.ds.StringMap();
		if(__map_reserved.auto_activate != null) _g67.setReserved("auto_activate","3"); else _g67.h["auto_activate"] = "3";
		if(__map_reserved.alias != null) _g67.setReserved("alias","Vector"); else _g67.h["alias"] = "Vector";
		value66 = _g67;
		if(__map_reserved.options != null) _g58.setReserved("options",value66); else _g58.h["options"] = value66;
		var value67;
		var _g68 = new haxe.ds.StringMap();
		if(__map_reserved.Name != null) _g68.setReserved("Name","vectorId"); else _g68.h["Name"] = "vectorId";
		if(__map_reserved.Comments != null) _g68.setReserved("Comments","vectorComments"); else _g68.h["Comments"] = "vectorComments";
		if(__map_reserved.Protease != null) _g68.setReserved("Protease","proteaseName"); else _g68.h["Protease"] = "proteaseName";
		if(__map_reserved["Protease cut sequence"] != null) _g68.setReserved("Protease cut sequence","proteaseCutSequence"); else _g68.h["Protease cut sequence"] = "proteaseCutSequence";
		if(__map_reserved["Protease product"] != null) _g68.setReserved("Protease product","proteaseProduct"); else _g68.h["Protease product"] = "proteaseProduct";
		if(__map_reserved["Forward extension"] != null) _g68.setReserved("Forward extension","requiredForwardExtension"); else _g68.h["Forward extension"] = "requiredForwardExtension";
		if(__map_reserved["Reverse extension"] != null) _g68.setReserved("Reverse extension","requiredReverseExtension"); else _g68.h["Reverse extension"] = "requiredReverseExtension";
		if(__map_reserved["Restriction site 1"] != null) _g68.setReserved("Restriction site 1","res1.enzymeName"); else _g68.h["Restriction site 1"] = "res1.enzymeName";
		if(__map_reserved["Restriction site 2"] != null) _g68.setReserved("Restriction site 2","res2.enzymeName"); else _g68.h["Restriction site 2"] = "res2.enzymeName";
		value67 = _g68;
		if(__map_reserved.model != null) _g58.setReserved("model",value67); else _g58.h["model"] = value67;
		value57 = _g58;
		if(__map_reserved["saturn.core.domain.SgcVector"] != null) _g.setReserved("saturn.core.domain.SgcVector",value57); else _g.h["saturn.core.domain.SgcVector"] = value57;
		var value68;
		var _g69 = new haxe.ds.StringMap();
		var value69;
		var _g70 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g70.setReserved("primerId","PRIMERID"); else _g70.h["primerId"] = "PRIMERID";
		if(__map_reserved.id != null) _g70.setReserved("id","PKEY"); else _g70.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g70.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g70.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		if(__map_reserved.targetId != null) _g70.setReserved("targetId","SGCTARGET"); else _g70.h["targetId"] = "SGCTARGET";
		value69 = _g70;
		if(__map_reserved.fields != null) _g69.setReserved("fields",value69); else _g69.h["fields"] = value69;
		var value70;
		var _g71 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g71.setReserved("primerId",false); else _g71.h["primerId"] = false;
		if(__map_reserved.id != null) _g71.setReserved("id",true); else _g71.h["id"] = true;
		value70 = _g71;
		if(__map_reserved.indexes != null) _g69.setReserved("indexes",value70); else _g69.h["indexes"] = value70;
		var value71;
		var _g72 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g72.setReserved("schema","SGC"); else _g72.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g72.setReserved("name","PRIMER"); else _g72.h["name"] = "PRIMER";
		value71 = _g72;
		if(__map_reserved.table_info != null) _g69.setReserved("table_info",value71); else _g69.h["table_info"] = value71;
		var value72;
		var _g73 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g73.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g73.h["saturn.client.programs.DNASequenceEditor"] = true;
		value72 = _g73;
		if(__map_reserved.programs != null) _g69.setReserved("programs",value72); else _g69.h["programs"] = value72;
		var value73;
		var _g74 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g74.setReserved("primerId",true); else _g74.h["primerId"] = true;
		value73 = _g74;
		if(__map_reserved.search != null) _g69.setReserved("search",value73); else _g69.h["search"] = value73;
		var value74;
		var _g75 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g75.setReserved("alias","Forward Primer"); else _g75.h["alias"] = "Forward Primer";
		if(__map_reserved.icon != null) _g75.setReserved("icon","dna_conical_16.png"); else _g75.h["icon"] = "dna_conical_16.png";
		value74 = _g75;
		if(__map_reserved.options != null) _g69.setReserved("options",value74); else _g69.h["options"] = value74;
		var value75;
		var _g76 = new haxe.ds.StringMap();
		if(__map_reserved["Primer ID"] != null) _g76.setReserved("Primer ID","primerId"); else _g76.h["Primer ID"] = "primerId";
		value75 = _g76;
		if(__map_reserved.model != null) _g69.setReserved("model",value75); else _g69.h["model"] = value75;
		value68 = _g69;
		if(__map_reserved["saturn.core.domain.SgcForwardPrimer"] != null) _g.setReserved("saturn.core.domain.SgcForwardPrimer",value68); else _g.h["saturn.core.domain.SgcForwardPrimer"] = value68;
		var value76;
		var _g77 = new haxe.ds.StringMap();
		var value77;
		var _g78 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g78.setReserved("primerId","PRIMERREVID"); else _g78.h["primerId"] = "PRIMERREVID";
		if(__map_reserved.id != null) _g78.setReserved("id","PKEY"); else _g78.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g78.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g78.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		if(__map_reserved.targetId != null) _g78.setReserved("targetId","SGCTARGET"); else _g78.h["targetId"] = "SGCTARGET";
		value77 = _g78;
		if(__map_reserved.fields != null) _g77.setReserved("fields",value77); else _g77.h["fields"] = value77;
		var value78;
		var _g79 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g79.setReserved("primerId",false); else _g79.h["primerId"] = false;
		if(__map_reserved.id != null) _g79.setReserved("id",true); else _g79.h["id"] = true;
		value78 = _g79;
		if(__map_reserved.indexes != null) _g77.setReserved("indexes",value78); else _g77.h["indexes"] = value78;
		var value79;
		var _g80 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g80.setReserved("schema","SGC"); else _g80.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g80.setReserved("name","PRIMERREV"); else _g80.h["name"] = "PRIMERREV";
		value79 = _g80;
		if(__map_reserved.table_info != null) _g77.setReserved("table_info",value79); else _g77.h["table_info"] = value79;
		var value80;
		var _g81 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g81.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g81.h["saturn.client.programs.DNASequenceEditor"] = true;
		value80 = _g81;
		if(__map_reserved.programs != null) _g77.setReserved("programs",value80); else _g77.h["programs"] = value80;
		var value81;
		var _g82 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g82.setReserved("primerId",true); else _g82.h["primerId"] = true;
		value81 = _g82;
		if(__map_reserved.search != null) _g77.setReserved("search",value81); else _g77.h["search"] = value81;
		var value82;
		var _g83 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g83.setReserved("alias","Reverse Primer"); else _g83.h["alias"] = "Reverse Primer";
		if(__map_reserved.icon != null) _g83.setReserved("icon","dna_conical_16.png"); else _g83.h["icon"] = "dna_conical_16.png";
		value82 = _g83;
		if(__map_reserved.options != null) _g77.setReserved("options",value82); else _g77.h["options"] = value82;
		var value83;
		var _g84 = new haxe.ds.StringMap();
		if(__map_reserved["Primer ID"] != null) _g84.setReserved("Primer ID","primerId"); else _g84.h["Primer ID"] = "primerId";
		value83 = _g84;
		if(__map_reserved.model != null) _g77.setReserved("model",value83); else _g77.h["model"] = value83;
		value76 = _g77;
		if(__map_reserved["saturn.core.domain.SgcReversePrimer"] != null) _g.setReserved("saturn.core.domain.SgcReversePrimer",value76); else _g.h["saturn.core.domain.SgcReversePrimer"] = value76;
		var value84;
		var _g85 = new haxe.ds.StringMap();
		var value85;
		var _g86 = new haxe.ds.StringMap();
		if(__map_reserved.purificationId != null) _g86.setReserved("purificationId","PURIFICATIONID"); else _g86.h["purificationId"] = "PURIFICATIONID";
		if(__map_reserved.id != null) _g86.setReserved("id","PKEY"); else _g86.h["id"] = "PKEY";
		if(__map_reserved.expressionId != null) _g86.setReserved("expressionId","SGCSCALEUPEXPRESSION"); else _g86.h["expressionId"] = "SGCSCALEUPEXPRESSION";
		if(__map_reserved.column != null) _g86.setReserved("column","COLUMN1"); else _g86.h["column"] = "COLUMN1";
		if(__map_reserved.elnId != null) _g86.setReserved("elnId","ELNEXPERIMENT"); else _g86.h["elnId"] = "ELNEXPERIMENT";
		value85 = _g86;
		if(__map_reserved.fields != null) _g85.setReserved("fields",value85); else _g85.h["fields"] = value85;
		var value86;
		var _g87 = new haxe.ds.StringMap();
		if(__map_reserved.purificationId != null) _g87.setReserved("purificationId",false); else _g87.h["purificationId"] = false;
		if(__map_reserved.id != null) _g87.setReserved("id",true); else _g87.h["id"] = true;
		value86 = _g87;
		if(__map_reserved.indexes != null) _g85.setReserved("indexes",value86); else _g85.h["indexes"] = value86;
		var value87;
		var _g88 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g88.setReserved("schema","SGC"); else _g88.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g88.setReserved("name","PURIFICATION"); else _g88.h["name"] = "PURIFICATION";
		value87 = _g88;
		if(__map_reserved.table_info != null) _g85.setReserved("table_info",value87); else _g85.h["table_info"] = value87;
		var value88;
		var _g89 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g89.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g89.h["saturn.client.programs.DNASequenceEditor"] = true;
		value88 = _g89;
		if(__map_reserved.programs != null) _g85.setReserved("programs",value88); else _g85.h["programs"] = value88;
		var value89;
		var _g90 = new haxe.ds.StringMap();
		var value90;
		var _g91 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g91.setReserved("field","expressionId"); else _g91.h["field"] = "expressionId";
		if(__map_reserved["class"] != null) _g91.setReserved("class","saturn.core.domain.SgcExpression"); else _g91.h["class"] = "saturn.core.domain.SgcExpression";
		if(__map_reserved.fk_field != null) _g91.setReserved("fk_field","expressionId"); else _g91.h["fk_field"] = "expressionId";
		value90 = _g91;
		_g90.set("expression",value90);
		value89 = _g90;
		if(__map_reserved["fields.synthetic"] != null) _g85.setReserved("fields.synthetic",value89); else _g85.h["fields.synthetic"] = value89;
		var value91;
		var _g92 = new haxe.ds.StringMap();
		if(__map_reserved["Purification ID"] != null) _g92.setReserved("Purification ID","purificationId"); else _g92.h["Purification ID"] = "purificationId";
		value91 = _g92;
		if(__map_reserved.model != null) _g85.setReserved("model",value91); else _g85.h["model"] = value91;
		value84 = _g85;
		if(__map_reserved["saturn.core.domain.SgcPurification"] != null) _g.setReserved("saturn.core.domain.SgcPurification",value84); else _g.h["saturn.core.domain.SgcPurification"] = value84;
		var value92;
		var _g93 = new haxe.ds.StringMap();
		var value93;
		var _g94 = new haxe.ds.StringMap();
		if(__map_reserved.cloneId != null) _g94.setReserved("cloneId","CLONEID"); else _g94.h["cloneId"] = "CLONEID";
		if(__map_reserved.id != null) _g94.setReserved("id","PKEY"); else _g94.h["id"] = "PKEY";
		if(__map_reserved.constructId != null) _g94.setReserved("constructId","SGCCONSTRUCT1"); else _g94.h["constructId"] = "SGCCONSTRUCT1";
		if(__map_reserved.elnId != null) _g94.setReserved("elnId","ELNEXP"); else _g94.h["elnId"] = "ELNEXP";
		value93 = _g94;
		if(__map_reserved.fields != null) _g93.setReserved("fields",value93); else _g93.h["fields"] = value93;
		var value94;
		var _g95 = new haxe.ds.StringMap();
		if(__map_reserved.cloneId != null) _g95.setReserved("cloneId",false); else _g95.h["cloneId"] = false;
		if(__map_reserved.id != null) _g95.setReserved("id",true); else _g95.h["id"] = true;
		value94 = _g95;
		if(__map_reserved.indexes != null) _g93.setReserved("indexes",value94); else _g93.h["indexes"] = value94;
		var value95;
		var _g96 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g96.setReserved("schema","SGC"); else _g96.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g96.setReserved("name","CLONE"); else _g96.h["name"] = "CLONE";
		value95 = _g96;
		if(__map_reserved.table_info != null) _g93.setReserved("table_info",value95); else _g93.h["table_info"] = value95;
		var value96;
		var _g97 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g97.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g97.h["saturn.client.programs.DNASequenceEditor"] = true;
		value96 = _g97;
		if(__map_reserved.programs != null) _g93.setReserved("programs",value96); else _g93.h["programs"] = value96;
		var value97;
		var _g98 = new haxe.ds.StringMap();
		var value98;
		var _g99 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g99.setReserved("field","constructId"); else _g99.h["field"] = "constructId";
		if(__map_reserved["class"] != null) _g99.setReserved("class","saturn.core.domain.SgcConstruct"); else _g99.h["class"] = "saturn.core.domain.SgcConstruct";
		if(__map_reserved.fk_field != null) _g99.setReserved("fk_field","constructId"); else _g99.h["fk_field"] = "constructId";
		value98 = _g99;
		_g98.set("construct",value98);
		value97 = _g98;
		if(__map_reserved["fields.synthetic"] != null) _g93.setReserved("fields.synthetic",value97); else _g93.h["fields.synthetic"] = value97;
		var value99;
		var _g100 = new haxe.ds.StringMap();
		if(__map_reserved["Clone ID"] != null) _g100.setReserved("Clone ID","cloneId"); else _g100.h["Clone ID"] = "cloneId";
		value99 = _g100;
		if(__map_reserved.model != null) _g93.setReserved("model",value99); else _g93.h["model"] = value99;
		value92 = _g93;
		if(__map_reserved["saturn.core.domain.SgcClone"] != null) _g.setReserved("saturn.core.domain.SgcClone",value92); else _g.h["saturn.core.domain.SgcClone"] = value92;
		var value100;
		var _g101 = new haxe.ds.StringMap();
		var value101;
		var _g102 = new haxe.ds.StringMap();
		if(__map_reserved.expressionId != null) _g102.setReserved("expressionId","SCALEUPEXPRESSIONID"); else _g102.h["expressionId"] = "SCALEUPEXPRESSIONID";
		if(__map_reserved.id != null) _g102.setReserved("id","PKEY"); else _g102.h["id"] = "PKEY";
		if(__map_reserved.cloneId != null) _g102.setReserved("cloneId","SGCCLONE"); else _g102.h["cloneId"] = "SGCCLONE";
		if(__map_reserved.elnId != null) _g102.setReserved("elnId","ELNEXPERIMENT"); else _g102.h["elnId"] = "ELNEXPERIMENT";
		value101 = _g102;
		if(__map_reserved.fields != null) _g101.setReserved("fields",value101); else _g101.h["fields"] = value101;
		var value102;
		var _g103 = new haxe.ds.StringMap();
		if(__map_reserved.expressionId != null) _g103.setReserved("expressionId",false); else _g103.h["expressionId"] = false;
		if(__map_reserved.id != null) _g103.setReserved("id",true); else _g103.h["id"] = true;
		value102 = _g103;
		if(__map_reserved.indexes != null) _g101.setReserved("indexes",value102); else _g101.h["indexes"] = value102;
		var value103;
		var _g104 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g104.setReserved("schema","SGC"); else _g104.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g104.setReserved("name","SCALEUPEXPRESSION"); else _g104.h["name"] = "SCALEUPEXPRESSION";
		value103 = _g104;
		if(__map_reserved.table_info != null) _g101.setReserved("table_info",value103); else _g101.h["table_info"] = value103;
		var value104;
		var _g105 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g105.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g105.h["saturn.client.programs.DNASequenceEditor"] = true;
		value104 = _g105;
		if(__map_reserved.programs != null) _g101.setReserved("programs",value104); else _g101.h["programs"] = value104;
		var value105;
		var _g106 = new haxe.ds.StringMap();
		var value106;
		var _g107 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g107.setReserved("field","cloneId"); else _g107.h["field"] = "cloneId";
		if(__map_reserved["class"] != null) _g107.setReserved("class","saturn.core.domain.SgcClone"); else _g107.h["class"] = "saturn.core.domain.SgcClone";
		if(__map_reserved.fk_field != null) _g107.setReserved("fk_field","cloneId"); else _g107.h["fk_field"] = "cloneId";
		value106 = _g107;
		_g106.set("clone",value106);
		value105 = _g106;
		if(__map_reserved["fields.synthetic"] != null) _g101.setReserved("fields.synthetic",value105); else _g101.h["fields.synthetic"] = value105;
		var value107;
		var _g108 = new haxe.ds.StringMap();
		if(__map_reserved["Expression ID"] != null) _g108.setReserved("Expression ID","expressionId"); else _g108.h["Expression ID"] = "expressionId";
		value107 = _g108;
		if(__map_reserved.model != null) _g101.setReserved("model",value107); else _g101.h["model"] = value107;
		value100 = _g101;
		if(__map_reserved["saturn.core.domain.SgcExpression"] != null) _g.setReserved("saturn.core.domain.SgcExpression",value100); else _g.h["saturn.core.domain.SgcExpression"] = value100;
		var value108;
		var _g109 = new haxe.ds.StringMap();
		var value109;
		var _g110 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g110.setReserved("targetId","TARGETNAME"); else _g110.h["targetId"] = "TARGETNAME";
		if(__map_reserved.id != null) _g110.setReserved("id","PKEY"); else _g110.h["id"] = "PKEY";
		if(__map_reserved.gi != null) _g110.setReserved("gi","GENBANKID"); else _g110.h["gi"] = "GENBANKID";
		if(__map_reserved.geneId != null) _g110.setReserved("geneId","NCBIGENEID"); else _g110.h["geneId"] = "NCBIGENEID";
		if(__map_reserved.proteinSeq != null) _g110.setReserved("proteinSeq","PROTSEQ"); else _g110.h["proteinSeq"] = "PROTSEQ";
		if(__map_reserved.dnaSeq != null) _g110.setReserved("dnaSeq","DNASEQ"); else _g110.h["dnaSeq"] = "DNASEQ";
		if(__map_reserved.activeStatus != null) _g110.setReserved("activeStatus","ACTIVESTATUS"); else _g110.h["activeStatus"] = "ACTIVESTATUS";
		value109 = _g110;
		if(__map_reserved.fields != null) _g109.setReserved("fields",value109); else _g109.h["fields"] = value109;
		var value110;
		var _g111 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g111.setReserved("targetId",false); else _g111.h["targetId"] = false;
		if(__map_reserved.id != null) _g111.setReserved("id",true); else _g111.h["id"] = true;
		value110 = _g111;
		if(__map_reserved.indexes != null) _g109.setReserved("indexes",value110); else _g109.h["indexes"] = value110;
		var value111;
		var _g112 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g112.setReserved("schema","SGC"); else _g112.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g112.setReserved("name","TARGET"); else _g112.h["name"] = "TARGET";
		if(__map_reserved.human_name != null) _g112.setReserved("human_name","Target"); else _g112.h["human_name"] = "Target";
		if(__map_reserved.human_name_plural != null) _g112.setReserved("human_name_plural","Targets"); else _g112.h["human_name_plural"] = "Targets";
		value111 = _g112;
		if(__map_reserved.table_info != null) _g109.setReserved("table_info",value111); else _g109.h["table_info"] = value111;
		var value112;
		var _g113 = new haxe.ds.StringMap();
		if(__map_reserved["Target ID"] != null) _g113.setReserved("Target ID","targetId"); else _g113.h["Target ID"] = "targetId";
		if(__map_reserved["Genbank ID"] != null) _g113.setReserved("Genbank ID","gi"); else _g113.h["Genbank ID"] = "gi";
		if(__map_reserved["DNA Sequence"] != null) _g113.setReserved("DNA Sequence","dnaSequence.sequence"); else _g113.h["DNA Sequence"] = "dnaSequence.sequence";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g113.setReserved("__HIDDEN__PKEY__","id"); else _g113.h["__HIDDEN__PKEY__"] = "id";
		value112 = _g113;
		if(__map_reserved.model != null) _g109.setReserved("model",value112); else _g109.h["model"] = value112;
		var value113;
		var _g114 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g114.setReserved("id_pattern",".*"); else _g114.h["id_pattern"] = ".*";
		if(__map_reserved.alias != null) _g114.setReserved("alias","Targets"); else _g114.h["alias"] = "Targets";
		if(__map_reserved.icon != null) _g114.setReserved("icon","protein_16.png"); else _g114.h["icon"] = "protein_16.png";
		value113 = _g114;
		if(__map_reserved.options != null) _g109.setReserved("options",value113); else _g109.h["options"] = value113;
		value108 = _g109;
		if(__map_reserved["saturn.core.domain.SgcTarget"] != null) _g.setReserved("saturn.core.domain.SgcTarget",value108); else _g.h["saturn.core.domain.SgcTarget"] = value108;
		var value114;
		var _g115 = new haxe.ds.StringMap();
		var value115;
		var _g116 = new haxe.ds.StringMap();
		if(__map_reserved.sequence != null) _g116.setReserved("sequence","SEQ"); else _g116.h["sequence"] = "SEQ";
		if(__map_reserved.id != null) _g116.setReserved("id","PKEY"); else _g116.h["id"] = "PKEY";
		if(__map_reserved.type != null) _g116.setReserved("type","SEQTYPE"); else _g116.h["type"] = "SEQTYPE";
		if(__map_reserved.version != null) _g116.setReserved("version","TARGETVERSION"); else _g116.h["version"] = "TARGETVERSION";
		if(__map_reserved.targetId != null) _g116.setReserved("targetId","SGCTARGET_PKEY"); else _g116.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.crc != null) _g116.setReserved("crc","CRC"); else _g116.h["crc"] = "CRC";
		if(__map_reserved.target != null) _g116.setReserved("target","TARGET_ID"); else _g116.h["target"] = "TARGET_ID";
		value115 = _g116;
		if(__map_reserved.fields != null) _g115.setReserved("fields",value115); else _g115.h["fields"] = value115;
		var value116;
		var _g117 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g117.setReserved("id",true); else _g117.h["id"] = true;
		value116 = _g117;
		if(__map_reserved.indexes != null) _g115.setReserved("indexes",value116); else _g115.h["indexes"] = value116;
		var value117;
		var _g118 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g118.setReserved("schema",""); else _g118.h["schema"] = "";
		if(__map_reserved.name != null) _g118.setReserved("name","SEQDATA"); else _g118.h["name"] = "SEQDATA";
		value117 = _g118;
		if(__map_reserved.table_info != null) _g115.setReserved("table_info",value117); else _g115.h["table_info"] = value117;
		var value118;
		var _g119 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g119.setReserved("field","type"); else _g119.h["field"] = "type";
		if(__map_reserved.value != null) _g119.setReserved("value","Nucleotide"); else _g119.h["value"] = "Nucleotide";
		value118 = _g119;
		if(__map_reserved.selector != null) _g115.setReserved("selector",value118); else _g115.h["selector"] = value118;
		value114 = _g115;
		if(__map_reserved["saturn.core.domain.SgcTargetDNA"] != null) _g.setReserved("saturn.core.domain.SgcTargetDNA",value114); else _g.h["saturn.core.domain.SgcTargetDNA"] = value114;
		var value119;
		var _g120 = new haxe.ds.StringMap();
		var value120;
		var _g121 = new haxe.ds.StringMap();
		if(__map_reserved.sequence != null) _g121.setReserved("sequence","SEQ"); else _g121.h["sequence"] = "SEQ";
		if(__map_reserved.id != null) _g121.setReserved("id","PKEY"); else _g121.h["id"] = "PKEY";
		if(__map_reserved.type != null) _g121.setReserved("type","SEQTYPE"); else _g121.h["type"] = "SEQTYPE";
		if(__map_reserved.version != null) _g121.setReserved("version","TARGETVERSION"); else _g121.h["version"] = "TARGETVERSION";
		if(__map_reserved.targetId != null) _g121.setReserved("targetId","SGCTARGET_PKEY"); else _g121.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.crc != null) _g121.setReserved("crc","CRC"); else _g121.h["crc"] = "CRC";
		if(__map_reserved.target != null) _g121.setReserved("target","TARGET_ID"); else _g121.h["target"] = "TARGET_ID";
		value120 = _g121;
		if(__map_reserved.fields != null) _g120.setReserved("fields",value120); else _g120.h["fields"] = value120;
		var value121;
		var _g122 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g122.setReserved("id",true); else _g122.h["id"] = true;
		value121 = _g122;
		if(__map_reserved.indexes != null) _g120.setReserved("indexes",value121); else _g120.h["indexes"] = value121;
		var value122;
		var _g123 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g123.setReserved("schema",""); else _g123.h["schema"] = "";
		if(__map_reserved.name != null) _g123.setReserved("name","SEQDATA"); else _g123.h["name"] = "SEQDATA";
		value122 = _g123;
		if(__map_reserved.table_info != null) _g120.setReserved("table_info",value122); else _g120.h["table_info"] = value122;
		value119 = _g120;
		if(__map_reserved["saturn.core.domain.SgcSeqData"] != null) _g.setReserved("saturn.core.domain.SgcSeqData",value119); else _g.h["saturn.core.domain.SgcSeqData"] = value119;
		var value123;
		var _g124 = new haxe.ds.StringMap();
		var value124;
		var _g125 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g125.setReserved("id","PKEY"); else _g125.h["id"] = "PKEY";
		if(__map_reserved.accession != null) _g125.setReserved("accession","IDENTIFIER"); else _g125.h["accession"] = "IDENTIFIER";
		if(__map_reserved.start != null) _g125.setReserved("start","SEQSTART"); else _g125.h["start"] = "SEQSTART";
		if(__map_reserved.stop != null) _g125.setReserved("stop","SEQSTOP"); else _g125.h["stop"] = "SEQSTOP";
		if(__map_reserved.targetId != null) _g125.setReserved("targetId","SGCTARGET_PKEY"); else _g125.h["targetId"] = "SGCTARGET_PKEY";
		value124 = _g125;
		if(__map_reserved.fields != null) _g124.setReserved("fields",value124); else _g124.h["fields"] = value124;
		var value125;
		var _g126 = new haxe.ds.StringMap();
		if(__map_reserved.accession != null) _g126.setReserved("accession",false); else _g126.h["accession"] = false;
		if(__map_reserved.id != null) _g126.setReserved("id",true); else _g126.h["id"] = true;
		value125 = _g126;
		if(__map_reserved.indexes != null) _g124.setReserved("indexes",value125); else _g124.h["indexes"] = value125;
		value123 = _g124;
		if(__map_reserved["saturn.core.domain.SgcDomain"] != null) _g.setReserved("saturn.core.domain.SgcDomain",value123); else _g.h["saturn.core.domain.SgcDomain"] = value123;
		var value126;
		var _g127 = new haxe.ds.StringMap();
		var value127;
		var _g128 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g128.setReserved("id","PKEY"); else _g128.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g128.setReserved("plateName","PLATENAME"); else _g128.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g128.setReserved("elnRef","ELNREF"); else _g128.h["elnRef"] = "ELNREF";
		value127 = _g128;
		if(__map_reserved.fields != null) _g127.setReserved("fields",value127); else _g127.h["fields"] = value127;
		var value128;
		var _g129 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g129.setReserved("plateName",false); else _g129.h["plateName"] = false;
		if(__map_reserved.id != null) _g129.setReserved("id",true); else _g129.h["id"] = true;
		value128 = _g129;
		if(__map_reserved.indexes != null) _g127.setReserved("indexes",value128); else _g127.h["indexes"] = value128;
		var value129;
		var _g130 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g130.setReserved("schema","SGC"); else _g130.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g130.setReserved("name","PLATE"); else _g130.h["name"] = "PLATE";
		value129 = _g130;
		if(__map_reserved.table_info != null) _g127.setReserved("table_info",value129); else _g127.h["table_info"] = value129;
		var value130;
		var _g131 = new haxe.ds.StringMap();
		if(__map_reserved.workspace_wrapper != null) _g131.setReserved("workspace_wrapper","saturn.client.workspace.MultiConstructHelperWO"); else _g131.h["workspace_wrapper"] = "saturn.client.workspace.MultiConstructHelperWO";
		if(__map_reserved.icon != null) _g131.setReserved("icon","dna_conical_16.png"); else _g131.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.alias != null) _g131.setReserved("alias","Construct Plate"); else _g131.h["alias"] = "Construct Plate";
		value130 = _g131;
		if(__map_reserved.options != null) _g127.setReserved("options",value130); else _g127.h["options"] = value130;
		var value131;
		var _g132 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g132.setReserved("plateName",true); else _g132.h["plateName"] = true;
		value131 = _g132;
		if(__map_reserved.fts != null) _g127.setReserved("fts",value131); else _g127.h["fts"] = value131;
		value126 = _g127;
		if(__map_reserved["saturn.core.domain.SgcConstructPlate"] != null) _g.setReserved("saturn.core.domain.SgcConstructPlate",value126); else _g.h["saturn.core.domain.SgcConstructPlate"] = value126;
		var value132;
		var _g133 = new haxe.ds.StringMap();
		var value133;
		var _g134 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g134.setReserved("id","PKEY"); else _g134.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g134.setReserved("plateName","PLATENAME"); else _g134.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g134.setReserved("elnRef","ELNREF"); else _g134.h["elnRef"] = "ELNREF";
		value133 = _g134;
		if(__map_reserved.fields != null) _g133.setReserved("fields",value133); else _g133.h["fields"] = value133;
		var value134;
		var _g135 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g135.setReserved("plateName",false); else _g135.h["plateName"] = false;
		if(__map_reserved.id != null) _g135.setReserved("id",true); else _g135.h["id"] = true;
		value134 = _g135;
		if(__map_reserved.indexes != null) _g133.setReserved("indexes",value134); else _g133.h["indexes"] = value134;
		var value135;
		var _g136 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g136.setReserved("schema","SGC"); else _g136.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g136.setReserved("name","PLATE"); else _g136.h["name"] = "PLATE";
		value135 = _g136;
		if(__map_reserved.table_info != null) _g133.setReserved("table_info",value135); else _g133.h["table_info"] = value135;
		var value136;
		var _g137 = new haxe.ds.StringMap();
		if(__map_reserved.workspace_wrapper != null) _g137.setReserved("workspace_wrapper","saturn.client.workspace.MultiAlleleHelperWO"); else _g137.h["workspace_wrapper"] = "saturn.client.workspace.MultiAlleleHelperWO";
		if(__map_reserved.icon != null) _g137.setReserved("icon","dna_conical_16.png"); else _g137.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.alias != null) _g137.setReserved("alias","Allele Plate"); else _g137.h["alias"] = "Allele Plate";
		value136 = _g137;
		if(__map_reserved.options != null) _g133.setReserved("options",value136); else _g133.h["options"] = value136;
		var value137;
		var _g138 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g138.setReserved("plateName",true); else _g138.h["plateName"] = true;
		value137 = _g138;
		if(__map_reserved.fts != null) _g133.setReserved("fts",value137); else _g133.h["fts"] = value137;
		value132 = _g133;
		if(__map_reserved["saturn.core.domain.SgcAllelePlate"] != null) _g.setReserved("saturn.core.domain.SgcAllelePlate",value132); else _g.h["saturn.core.domain.SgcAllelePlate"] = value132;
		var value138;
		var _g139 = new haxe.ds.StringMap();
		var value139;
		var _g140 = new haxe.ds.StringMap();
		if(__map_reserved.dnaId != null) _g140.setReserved("dnaId","DNA_ID"); else _g140.h["dnaId"] = "DNA_ID";
		if(__map_reserved.id != null) _g140.setReserved("id","PKEY"); else _g140.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g140.setReserved("dnaSeq","DNASEQUENCE"); else _g140.h["dnaSeq"] = "DNASEQUENCE";
		value139 = _g140;
		if(__map_reserved.fields != null) _g139.setReserved("fields",value139); else _g139.h["fields"] = value139;
		var value140;
		var _g141 = new haxe.ds.StringMap();
		if(__map_reserved.dnaId != null) _g141.setReserved("dnaId",false); else _g141.h["dnaId"] = false;
		if(__map_reserved.id != null) _g141.setReserved("id",true); else _g141.h["id"] = true;
		value140 = _g141;
		if(__map_reserved.indexes != null) _g139.setReserved("indexes",value140); else _g139.h["indexes"] = value140;
		var value141;
		var _g142 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g142.setReserved("schema","SGC"); else _g142.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g142.setReserved("name","DNA"); else _g142.h["name"] = "DNA";
		value141 = _g142;
		if(__map_reserved.table_info != null) _g139.setReserved("table_info",value141); else _g139.h["table_info"] = value141;
		value138 = _g139;
		if(__map_reserved["saturn.core.domain.SgcDNA"] != null) _g.setReserved("saturn.core.domain.SgcDNA",value138); else _g.h["saturn.core.domain.SgcDNA"] = value138;
		var value142;
		var _g143 = new haxe.ds.StringMap();
		var value143;
		var _g144 = new haxe.ds.StringMap();
		if(__map_reserved.pageId != null) _g144.setReserved("pageId","PAGEID"); else _g144.h["pageId"] = "PAGEID";
		if(__map_reserved.id != null) _g144.setReserved("id","PKEY"); else _g144.h["id"] = "PKEY";
		if(__map_reserved.content != null) _g144.setReserved("content","CONTENT"); else _g144.h["content"] = "CONTENT";
		value143 = _g144;
		if(__map_reserved.fields != null) _g143.setReserved("fields",value143); else _g143.h["fields"] = value143;
		var value144;
		var _g145 = new haxe.ds.StringMap();
		if(__map_reserved.pageId != null) _g145.setReserved("pageId",false); else _g145.h["pageId"] = false;
		if(__map_reserved.id != null) _g145.setReserved("id",true); else _g145.h["id"] = true;
		value144 = _g145;
		if(__map_reserved.indexes != null) _g143.setReserved("indexes",value144); else _g143.h["indexes"] = value144;
		var value145;
		var _g146 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g146.setReserved("schema","SGC"); else _g146.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g146.setReserved("name","TIDDLY_WIKI"); else _g146.h["name"] = "TIDDLY_WIKI";
		value145 = _g146;
		if(__map_reserved.table_info != null) _g143.setReserved("table_info",value145); else _g143.h["table_info"] = value145;
		value142 = _g143;
		if(__map_reserved["saturn.core.domain.TiddlyWiki"] != null) _g.setReserved("saturn.core.domain.TiddlyWiki",value142); else _g.h["saturn.core.domain.TiddlyWiki"] = value142;
		var value146;
		var _g147 = new haxe.ds.StringMap();
		var value147;
		var _g148 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g148.setReserved("id","PKEY"); else _g148.h["id"] = "PKEY";
		if(__map_reserved.entityId != null) _g148.setReserved("entityId","ID"); else _g148.h["entityId"] = "ID";
		if(__map_reserved.dataSourceId != null) _g148.setReserved("dataSourceId","SOURCE_PKEY"); else _g148.h["dataSourceId"] = "SOURCE_PKEY";
		if(__map_reserved.reactionId != null) _g148.setReserved("reactionId","SGCREACTION_PKEY"); else _g148.h["reactionId"] = "SGCREACTION_PKEY";
		if(__map_reserved.entityTypeId != null) _g148.setReserved("entityTypeId","SGCENTITY_TYPE"); else _g148.h["entityTypeId"] = "SGCENTITY_TYPE";
		if(__map_reserved.altName != null) _g148.setReserved("altName","ALTNAME"); else _g148.h["altName"] = "ALTNAME";
		if(__map_reserved.description != null) _g148.setReserved("description","DESCRIPTION"); else _g148.h["description"] = "DESCRIPTION";
		value147 = _g148;
		if(__map_reserved.fields != null) _g147.setReserved("fields",value147); else _g147.h["fields"] = value147;
		var value148;
		var _g149 = new haxe.ds.StringMap();
		if(__map_reserved.entityId != null) _g149.setReserved("entityId",false); else _g149.h["entityId"] = false;
		if(__map_reserved.id != null) _g149.setReserved("id",true); else _g149.h["id"] = true;
		value148 = _g149;
		if(__map_reserved.indexes != null) _g147.setReserved("indexes",value148); else _g147.h["indexes"] = value148;
		var value149;
		var _g150 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g150.setReserved("schema","SGC"); else _g150.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g150.setReserved("name","Z_ENTITY"); else _g150.h["name"] = "Z_ENTITY";
		value149 = _g150;
		if(__map_reserved.table_info != null) _g147.setReserved("table_info",value149); else _g147.h["table_info"] = value149;
		var value150;
		var _g151 = new haxe.ds.StringMap();
		var value151;
		var _g152 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g152.setReserved("field","dataSourceId"); else _g152.h["field"] = "dataSourceId";
		if(__map_reserved["class"] != null) _g152.setReserved("class","saturn.core.domain.DataSource"); else _g152.h["class"] = "saturn.core.domain.DataSource";
		if(__map_reserved.fk_field != null) _g152.setReserved("fk_field","id"); else _g152.h["fk_field"] = "id";
		value151 = _g152;
		_g151.set("source",value151);
		var value152;
		var _g153 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g153.setReserved("field","reactionId"); else _g153.h["field"] = "reactionId";
		if(__map_reserved["class"] != null) _g153.setReserved("class","saturn.core.Reaction"); else _g153.h["class"] = "saturn.core.Reaction";
		if(__map_reserved.fk_field != null) _g153.setReserved("fk_field","id"); else _g153.h["fk_field"] = "id";
		value152 = _g153;
		_g151.set("reaction",value152);
		var value153;
		var _g154 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g154.setReserved("field","entityTypeId"); else _g154.h["field"] = "entityTypeId";
		if(__map_reserved["class"] != null) _g154.setReserved("class","saturn.core.EntityType"); else _g154.h["class"] = "saturn.core.EntityType";
		if(__map_reserved.fk_field != null) _g154.setReserved("fk_field","id"); else _g154.h["fk_field"] = "id";
		value153 = _g154;
		_g151.set("entityType",value153);
		value150 = _g151;
		if(__map_reserved["fields.synthetic"] != null) _g147.setReserved("fields.synthetic",value150); else _g147.h["fields.synthetic"] = value150;
		value146 = _g147;
		if(__map_reserved["saturn.core.domain.Entity"] != null) _g.setReserved("saturn.core.domain.Entity",value146); else _g.h["saturn.core.domain.Entity"] = value146;
		var value154;
		var _g155 = new haxe.ds.StringMap();
		var value155;
		var _g156 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g156.setReserved("id","PKEY"); else _g156.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g156.setReserved("name","ID"); else _g156.h["name"] = "ID";
		if(__map_reserved.sequence != null) _g156.setReserved("sequence","LINEAR_SEQUENCE"); else _g156.h["sequence"] = "LINEAR_SEQUENCE";
		if(__map_reserved.entityId != null) _g156.setReserved("entityId","SGCENTITY_PKEY"); else _g156.h["entityId"] = "SGCENTITY_PKEY";
		value155 = _g156;
		if(__map_reserved.fields != null) _g155.setReserved("fields",value155); else _g155.h["fields"] = value155;
		var value156;
		var _g157 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g157.setReserved("name",false); else _g157.h["name"] = false;
		if(__map_reserved.id != null) _g157.setReserved("id",true); else _g157.h["id"] = true;
		value156 = _g157;
		if(__map_reserved.indexes != null) _g155.setReserved("indexes",value156); else _g155.h["indexes"] = value156;
		var value157;
		var _g158 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g158.setReserved("schema","SGC"); else _g158.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g158.setReserved("name","Z_MOLECULE"); else _g158.h["name"] = "Z_MOLECULE";
		value157 = _g158;
		if(__map_reserved.table_info != null) _g155.setReserved("table_info",value157); else _g155.h["table_info"] = value157;
		var value158;
		var _g159 = new haxe.ds.StringMap();
		var value159;
		var _g160 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g160.setReserved("field","entityId"); else _g160.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g160.setReserved("class","saturn.core.Entity"); else _g160.h["class"] = "saturn.core.Entity";
		if(__map_reserved.fk_field != null) _g160.setReserved("fk_field","id"); else _g160.h["fk_field"] = "id";
		value159 = _g160;
		_g159.set("entity",value159);
		value158 = _g159;
		if(__map_reserved["fields.synthetic"] != null) _g155.setReserved("fields.synthetic",value158); else _g155.h["fields.synthetic"] = value158;
		value154 = _g155;
		if(__map_reserved["saturn.core.domain.Molecule"] != null) _g.setReserved("saturn.core.domain.Molecule",value154); else _g.h["saturn.core.domain.Molecule"] = value154;
		var value160;
		var _g161 = new haxe.ds.StringMap();
		var value161;
		var _g162 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g162.setReserved("id","PKEY"); else _g162.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g162.setReserved("name","NAME"); else _g162.h["name"] = "NAME";
		value161 = _g162;
		if(__map_reserved.fields != null) _g161.setReserved("fields",value161); else _g161.h["fields"] = value161;
		var value162;
		var _g163 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g163.setReserved("name",false); else _g163.h["name"] = false;
		if(__map_reserved.id != null) _g163.setReserved("id",true); else _g163.h["id"] = true;
		value162 = _g163;
		if(__map_reserved.indexes != null) _g161.setReserved("indexes",value162); else _g161.h["indexes"] = value162;
		var value163;
		var _g164 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g164.setReserved("schema","SGC"); else _g164.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g164.setReserved("name","Z_REACTION_TYPE"); else _g164.h["name"] = "Z_REACTION_TYPE";
		value163 = _g164;
		if(__map_reserved.table_info != null) _g161.setReserved("table_info",value163); else _g161.h["table_info"] = value163;
		value160 = _g161;
		if(__map_reserved["saturn.core.ReactionType"] != null) _g.setReserved("saturn.core.ReactionType",value160); else _g.h["saturn.core.ReactionType"] = value160;
		var value164;
		var _g165 = new haxe.ds.StringMap();
		var value165;
		var _g166 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g166.setReserved("id","PKEY"); else _g166.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g166.setReserved("name","NAME"); else _g166.h["name"] = "NAME";
		value165 = _g166;
		if(__map_reserved.fields != null) _g165.setReserved("fields",value165); else _g165.h["fields"] = value165;
		var value166;
		var _g167 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g167.setReserved("name",false); else _g167.h["name"] = false;
		if(__map_reserved.id != null) _g167.setReserved("id",true); else _g167.h["id"] = true;
		value166 = _g167;
		if(__map_reserved.indexes != null) _g165.setReserved("indexes",value166); else _g165.h["indexes"] = value166;
		var value167;
		var _g168 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g168.setReserved("schema","SGC"); else _g168.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g168.setReserved("name","Z_ENTITY_TYPE"); else _g168.h["name"] = "Z_ENTITY_TYPE";
		value167 = _g168;
		if(__map_reserved.table_info != null) _g165.setReserved("table_info",value167); else _g165.h["table_info"] = value167;
		value164 = _g165;
		if(__map_reserved["saturn.core.EntityType"] != null) _g.setReserved("saturn.core.EntityType",value164); else _g.h["saturn.core.EntityType"] = value164;
		var value168;
		var _g169 = new haxe.ds.StringMap();
		var value169;
		var _g170 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g170.setReserved("id","PKEY"); else _g170.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g170.setReserved("name","NAME"); else _g170.h["name"] = "NAME";
		value169 = _g170;
		if(__map_reserved.fields != null) _g169.setReserved("fields",value169); else _g169.h["fields"] = value169;
		var value170;
		var _g171 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g171.setReserved("name",false); else _g171.h["name"] = false;
		if(__map_reserved.id != null) _g171.setReserved("id",true); else _g171.h["id"] = true;
		value170 = _g171;
		if(__map_reserved.indexes != null) _g169.setReserved("indexes",value170); else _g169.h["indexes"] = value170;
		var value171;
		var _g172 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g172.setReserved("schema","SGC"); else _g172.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g172.setReserved("name","Z_REACTION_ROLE"); else _g172.h["name"] = "Z_REACTION_ROLE";
		value171 = _g172;
		if(__map_reserved.table_info != null) _g169.setReserved("table_info",value171); else _g169.h["table_info"] = value171;
		value168 = _g169;
		if(__map_reserved["saturn.core.ReactionRole"] != null) _g.setReserved("saturn.core.ReactionRole",value168); else _g.h["saturn.core.ReactionRole"] = value168;
		var value172;
		var _g173 = new haxe.ds.StringMap();
		var value173;
		var _g174 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g174.setReserved("id","PKEY"); else _g174.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g174.setReserved("name","NAME"); else _g174.h["name"] = "NAME";
		if(__map_reserved.reactionTypeId != null) _g174.setReserved("reactionTypeId","SGCREACTION_TYPE"); else _g174.h["reactionTypeId"] = "SGCREACTION_TYPE";
		value173 = _g174;
		if(__map_reserved.fields != null) _g173.setReserved("fields",value173); else _g173.h["fields"] = value173;
		var value174;
		var _g175 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g175.setReserved("name",false); else _g175.h["name"] = false;
		if(__map_reserved.id != null) _g175.setReserved("id",true); else _g175.h["id"] = true;
		value174 = _g175;
		if(__map_reserved.indexes != null) _g173.setReserved("indexes",value174); else _g173.h["indexes"] = value174;
		var value175;
		var _g176 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g176.setReserved("schema","SGC"); else _g176.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g176.setReserved("name","Z_REACTION"); else _g176.h["name"] = "Z_REACTION";
		value175 = _g176;
		if(__map_reserved.table_info != null) _g173.setReserved("table_info",value175); else _g173.h["table_info"] = value175;
		var value176;
		var _g177 = new haxe.ds.StringMap();
		var value177;
		var _g178 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g178.setReserved("field","reactionTypeId"); else _g178.h["field"] = "reactionTypeId";
		if(__map_reserved["class"] != null) _g178.setReserved("class","saturn.core.ReactionType"); else _g178.h["class"] = "saturn.core.ReactionType";
		if(__map_reserved.fk_field != null) _g178.setReserved("fk_field","id"); else _g178.h["fk_field"] = "id";
		value177 = _g178;
		_g177.set("reactionType",value177);
		value176 = _g177;
		if(__map_reserved["fields.synthetic"] != null) _g173.setReserved("fields.synthetic",value176); else _g173.h["fields.synthetic"] = value176;
		value172 = _g173;
		if(__map_reserved["saturn.core.Reaction"] != null) _g.setReserved("saturn.core.Reaction",value172); else _g.h["saturn.core.Reaction"] = value172;
		var value178;
		var _g179 = new haxe.ds.StringMap();
		var value179;
		var _g180 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g180.setReserved("id","PKEY"); else _g180.h["id"] = "PKEY";
		if(__map_reserved.reactionRoleId != null) _g180.setReserved("reactionRoleId","SGCROLE_PKEY"); else _g180.h["reactionRoleId"] = "SGCROLE_PKEY";
		if(__map_reserved.entityId != null) _g180.setReserved("entityId","SGCENTITY_PKEY"); else _g180.h["entityId"] = "SGCENTITY_PKEY";
		if(__map_reserved.reactionId != null) _g180.setReserved("reactionId","SGCREACTION_PKEY"); else _g180.h["reactionId"] = "SGCREACTION_PKEY";
		if(__map_reserved.position != null) _g180.setReserved("position","POSITION"); else _g180.h["position"] = "POSITION";
		value179 = _g180;
		if(__map_reserved.fields != null) _g179.setReserved("fields",value179); else _g179.h["fields"] = value179;
		var value180;
		var _g181 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g181.setReserved("id",true); else _g181.h["id"] = true;
		value180 = _g181;
		if(__map_reserved.indexes != null) _g179.setReserved("indexes",value180); else _g179.h["indexes"] = value180;
		var value181;
		var _g182 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g182.setReserved("schema","SGC"); else _g182.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g182.setReserved("name","Z_REACTION_COMPONENT"); else _g182.h["name"] = "Z_REACTION_COMPONENT";
		value181 = _g182;
		if(__map_reserved.table_info != null) _g179.setReserved("table_info",value181); else _g179.h["table_info"] = value181;
		var value182;
		var _g183 = new haxe.ds.StringMap();
		var value183;
		var _g184 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g184.setReserved("field","reactionRoleId"); else _g184.h["field"] = "reactionRoleId";
		if(__map_reserved["class"] != null) _g184.setReserved("class","saturn.core.ReactionRole"); else _g184.h["class"] = "saturn.core.ReactionRole";
		if(__map_reserved.fk_field != null) _g184.setReserved("fk_field","id"); else _g184.h["fk_field"] = "id";
		value183 = _g184;
		_g183.set("reactionRole",value183);
		var value184;
		var _g185 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g185.setReserved("field","reactionId"); else _g185.h["field"] = "reactionId";
		if(__map_reserved["class"] != null) _g185.setReserved("class","saturn.core.Reaction"); else _g185.h["class"] = "saturn.core.Reaction";
		if(__map_reserved.fk_field != null) _g185.setReserved("fk_field","id"); else _g185.h["fk_field"] = "id";
		value184 = _g185;
		_g183.set("reaction",value184);
		var value185;
		var _g186 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g186.setReserved("field","entityId"); else _g186.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g186.setReserved("class","saturn.core.Entity"); else _g186.h["class"] = "saturn.core.Entity";
		if(__map_reserved.fk_field != null) _g186.setReserved("fk_field","id"); else _g186.h["fk_field"] = "id";
		value185 = _g186;
		_g183.set("entity",value185);
		value182 = _g183;
		if(__map_reserved["fields.synthetic"] != null) _g179.setReserved("fields.synthetic",value182); else _g179.h["fields.synthetic"] = value182;
		value178 = _g179;
		if(__map_reserved["saturn.core.ReactionComponent"] != null) _g.setReserved("saturn.core.ReactionComponent",value178); else _g.h["saturn.core.ReactionComponent"] = value178;
		var value186;
		var _g187 = new haxe.ds.StringMap();
		var value187;
		var _g188 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g188.setReserved("id","PKEY"); else _g188.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g188.setReserved("name","NAME"); else _g188.h["name"] = "NAME";
		value187 = _g188;
		if(__map_reserved.fields != null) _g187.setReserved("fields",value187); else _g187.h["fields"] = value187;
		var value188;
		var _g189 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g189.setReserved("name",false); else _g189.h["name"] = false;
		if(__map_reserved.id != null) _g189.setReserved("id",true); else _g189.h["id"] = true;
		value188 = _g189;
		if(__map_reserved.indexes != null) _g187.setReserved("indexes",value188); else _g187.h["indexes"] = value188;
		var value189;
		var _g190 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g190.setReserved("schema","SGC"); else _g190.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g190.setReserved("name","Z_ENTITY_SOURCE"); else _g190.h["name"] = "Z_ENTITY_SOURCE";
		value189 = _g190;
		if(__map_reserved.table_info != null) _g187.setReserved("table_info",value189); else _g187.h["table_info"] = value189;
		value186 = _g187;
		if(__map_reserved["saturn.core.domain.DataSource"] != null) _g.setReserved("saturn.core.domain.DataSource",value186); else _g.h["saturn.core.domain.DataSource"] = value186;
		var value190;
		var _g191 = new haxe.ds.StringMap();
		var value191;
		var _g192 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g192.setReserved("id","PKEY"); else _g192.h["id"] = "PKEY";
		if(__map_reserved.entityId != null) _g192.setReserved("entityId","SGCENTITY_PKEY"); else _g192.h["entityId"] = "SGCENTITY_PKEY";
		if(__map_reserved.labelId != null) _g192.setReserved("labelId","XREF_SGCENTITY_PKEY"); else _g192.h["labelId"] = "XREF_SGCENTITY_PKEY";
		if(__map_reserved.start != null) _g192.setReserved("start","STARTPOS"); else _g192.h["start"] = "STARTPOS";
		if(__map_reserved.stop != null) _g192.setReserved("stop","STOPPOS"); else _g192.h["stop"] = "STOPPOS";
		if(__map_reserved.evalue != null) _g192.setReserved("evalue","EVALUE"); else _g192.h["evalue"] = "EVALUE";
		value191 = _g192;
		if(__map_reserved.fields != null) _g191.setReserved("fields",value191); else _g191.h["fields"] = value191;
		var value192;
		var _g193 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g193.setReserved("id",true); else _g193.h["id"] = true;
		value192 = _g193;
		if(__map_reserved.indexes != null) _g191.setReserved("indexes",value192); else _g191.h["indexes"] = value192;
		var value193;
		var _g194 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g194.setReserved("schema","SGC"); else _g194.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g194.setReserved("name","Z_ANNOTATION"); else _g194.h["name"] = "Z_ANNOTATION";
		value193 = _g194;
		if(__map_reserved.table_info != null) _g191.setReserved("table_info",value193); else _g191.h["table_info"] = value193;
		var value194;
		var _g195 = new haxe.ds.StringMap();
		var value195;
		var _g196 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g196.setReserved("field","entityId"); else _g196.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g196.setReserved("class","saturn.core.domain.Entity"); else _g196.h["class"] = "saturn.core.domain.Entity";
		if(__map_reserved.fk_field != null) _g196.setReserved("fk_field","id"); else _g196.h["fk_field"] = "id";
		value195 = _g196;
		_g195.set("entity",value195);
		var value196;
		var _g197 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g197.setReserved("field","labelId"); else _g197.h["field"] = "labelId";
		if(__map_reserved["class"] != null) _g197.setReserved("class","saturn.core.domain.Entity"); else _g197.h["class"] = "saturn.core.domain.Entity";
		if(__map_reserved.fk_field != null) _g197.setReserved("fk_field","id"); else _g197.h["fk_field"] = "id";
		value196 = _g197;
		_g195.set("referent",value196);
		value194 = _g195;
		if(__map_reserved["fields.synthetic"] != null) _g191.setReserved("fields.synthetic",value194); else _g191.h["fields.synthetic"] = value194;
		value190 = _g191;
		if(__map_reserved["saturn.core.domain.MoleculeAnnotation"] != null) _g.setReserved("saturn.core.domain.MoleculeAnnotation",value190); else _g.h["saturn.core.domain.MoleculeAnnotation"] = value190;
		var value197;
		var _g198 = new haxe.ds.StringMap();
		var value198;
		var _g199 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g199.setReserved("id","PKEY"); else _g199.h["id"] = "PKEY";
		if(__map_reserved.modelId != null) _g199.setReserved("modelId","MODELID"); else _g199.h["modelId"] = "MODELID";
		if(__map_reserved.pathToPdb != null) _g199.setReserved("pathToPdb","PATHTOPDB"); else _g199.h["pathToPdb"] = "PATHTOPDB";
		value198 = _g199;
		if(__map_reserved.fields != null) _g198.setReserved("fields",value198); else _g198.h["fields"] = value198;
		var value199;
		var _g200 = new haxe.ds.StringMap();
		if(__map_reserved.modelId != null) _g200.setReserved("modelId",false); else _g200.h["modelId"] = false;
		if(__map_reserved.id != null) _g200.setReserved("id",true); else _g200.h["id"] = true;
		value199 = _g200;
		if(__map_reserved.indexes != null) _g198.setReserved("indexes",value199); else _g198.h["indexes"] = value199;
		var value200;
		var _g201 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g201.setReserved("schema","SGC"); else _g201.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g201.setReserved("name","MODEL"); else _g201.h["name"] = "MODEL";
		value200 = _g201;
		if(__map_reserved.table_info != null) _g198.setReserved("table_info",value200); else _g198.h["table_info"] = value200;
		var value201;
		var _g202 = new haxe.ds.StringMap();
		var value202;
		var _g203 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g203.setReserved("field","pathToPdb"); else _g203.h["field"] = "pathToPdb";
		if(__map_reserved["class"] != null) _g203.setReserved("class","saturn.core.domain.FileProxy"); else _g203.h["class"] = "saturn.core.domain.FileProxy";
		if(__map_reserved.fk_field != null) _g203.setReserved("fk_field","path"); else _g203.h["fk_field"] = "path";
		value202 = _g203;
		_g202.set("pdb",value202);
		value201 = _g202;
		if(__map_reserved["fields.synthetic"] != null) _g198.setReserved("fields.synthetic",value201); else _g198.h["fields.synthetic"] = value201;
		var value203;
		var _g204 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g204.setReserved("id_pattern","\\w+-m"); else _g204.h["id_pattern"] = "\\w+-m";
		if(__map_reserved.workspace_wrapper != null) _g204.setReserved("workspace_wrapper","saturn.client.workspace.StructureModelWO"); else _g204.h["workspace_wrapper"] = "saturn.client.workspace.StructureModelWO";
		if(__map_reserved.icon != null) _g204.setReserved("icon","structure_16.png"); else _g204.h["icon"] = "structure_16.png";
		if(__map_reserved.alias != null) _g204.setReserved("alias","Models"); else _g204.h["alias"] = "Models";
		value203 = _g204;
		if(__map_reserved.options != null) _g198.setReserved("options",value203); else _g198.h["options"] = value203;
		var value204;
		var _g205 = new haxe.ds.StringMap();
		if(__map_reserved.modelId != null) _g205.setReserved("modelId","\\w+-m"); else _g205.h["modelId"] = "\\w+-m";
		value204 = _g205;
		if(__map_reserved.search != null) _g198.setReserved("search",value204); else _g198.h["search"] = value204;
		var value205;
		var _g206 = new haxe.ds.StringMap();
		if(__map_reserved["Model ID"] != null) _g206.setReserved("Model ID","modelId"); else _g206.h["Model ID"] = "modelId";
		if(__map_reserved["Path to PDB"] != null) _g206.setReserved("Path to PDB","pathToPdb"); else _g206.h["Path to PDB"] = "pathToPdb";
		value205 = _g206;
		if(__map_reserved.model != null) _g198.setReserved("model",value205); else _g198.h["model"] = value205;
		value197 = _g198;
		if(__map_reserved["saturn.core.domain.StructureModel"] != null) _g.setReserved("saturn.core.domain.StructureModel",value197); else _g.h["saturn.core.domain.StructureModel"] = value197;
		var value206;
		var _g207 = new haxe.ds.StringMap();
		var value207;
		var _g208 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g208.setReserved("path","PATH"); else _g208.h["path"] = "PATH";
		if(__map_reserved.content != null) _g208.setReserved("content","CONTENT"); else _g208.h["content"] = "CONTENT";
		value207 = _g208;
		if(__map_reserved.fields != null) _g207.setReserved("fields",value207); else _g207.h["fields"] = value207;
		var value208;
		var _g209 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g209.setReserved("path",true); else _g209.h["path"] = true;
		value208 = _g209;
		if(__map_reserved.indexes != null) _g207.setReserved("indexes",value208); else _g207.h["indexes"] = value208;
		var value209;
		var _g210 = new haxe.ds.StringMap();
		var value210;
		var _g211 = new haxe.ds.StringMap();
		if(__map_reserved["/work"] != null) _g211.setReserved("/work","W:"); else _g211.h["/work"] = "W:";
		if(__map_reserved["/home/share"] != null) _g211.setReserved("/home/share","S:"); else _g211.h["/home/share"] = "S:";
		value210 = _g211;
		_g210.set("windows_conversions",value210);
		var value211;
		var _g212 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g212.setReserved("WORK","^W"); else _g212.h["WORK"] = "^W";
		value211 = _g212;
		_g210.set("windows_allowed_paths_regex",value211);
		var value212;
		var _g213 = new haxe.ds.StringMap();
		if(__map_reserved["W:"] != null) _g213.setReserved("W:","/work"); else _g213.h["W:"] = "/work";
		value212 = _g213;
		_g210.set("linux_conversions",value212);
		var value213;
		var _g214 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g214.setReserved("WORK","^/work"); else _g214.h["WORK"] = "^/work";
		value213 = _g214;
		_g210.set("linux_allowed_paths_regex",value213);
		value209 = _g210;
		if(__map_reserved.options != null) _g207.setReserved("options",value209); else _g207.h["options"] = value209;
		value206 = _g207;
		if(__map_reserved["saturn.core.domain.FileProxy"] != null) _g.setReserved("saturn.core.domain.FileProxy",value206); else _g.h["saturn.core.domain.FileProxy"] = value206;
		var value214;
		var _g215 = new haxe.ds.StringMap();
		var value215;
		var _g216 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g216.setReserved("moleculeName","NAME"); else _g216.h["moleculeName"] = "NAME";
		value215 = _g216;
		if(__map_reserved.fields != null) _g215.setReserved("fields",value215); else _g215.h["fields"] = value215;
		var value216;
		var _g217 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g217.setReserved("moleculeName",true); else _g217.h["moleculeName"] = true;
		value216 = _g217;
		if(__map_reserved.indexes != null) _g215.setReserved("indexes",value216); else _g215.h["indexes"] = value216;
		var value217;
		var _g218 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g218.setReserved("saturn.client.programs.DNASequenceEditor",false); else _g218.h["saturn.client.programs.DNASequenceEditor"] = false;
		value217 = _g218;
		if(__map_reserved.programs != null) _g215.setReserved("programs",value217); else _g215.h["programs"] = value217;
		var value218;
		var _g219 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g219.setReserved("alias","DNA"); else _g219.h["alias"] = "DNA";
		if(__map_reserved.icon != null) _g219.setReserved("icon","dna_conical_16.png"); else _g219.h["icon"] = "dna_conical_16.png";
		value218 = _g219;
		if(__map_reserved.options != null) _g215.setReserved("options",value218); else _g215.h["options"] = value218;
		value214 = _g215;
		if(__map_reserved["saturn.core.DNA"] != null) _g.setReserved("saturn.core.DNA",value214); else _g.h["saturn.core.DNA"] = value214;
		var value219;
		var _g220 = new haxe.ds.StringMap();
		var value220;
		var _g221 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g221.setReserved("moleculeName","NAME"); else _g221.h["moleculeName"] = "NAME";
		value220 = _g221;
		if(__map_reserved.fields != null) _g220.setReserved("fields",value220); else _g220.h["fields"] = value220;
		var value221;
		var _g222 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g222.setReserved("moleculeName",true); else _g222.h["moleculeName"] = true;
		value221 = _g222;
		if(__map_reserved.indexes != null) _g220.setReserved("indexes",value221); else _g220.h["indexes"] = value221;
		var value222;
		var _g223 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g223.setReserved("saturn.client.programs.ProteinSequenceEditor",false); else _g223.h["saturn.client.programs.ProteinSequenceEditor"] = false;
		value222 = _g223;
		if(__map_reserved.programs != null) _g220.setReserved("programs",value222); else _g220.h["programs"] = value222;
		var value223;
		var _g224 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g224.setReserved("alias","Proteins"); else _g224.h["alias"] = "Proteins";
		if(__map_reserved.icon != null) _g224.setReserved("icon","structure_16.png"); else _g224.h["icon"] = "structure_16.png";
		value223 = _g224;
		if(__map_reserved.options != null) _g220.setReserved("options",value223); else _g220.h["options"] = value223;
		value219 = _g220;
		if(__map_reserved["saturn.core.Protein"] != null) _g.setReserved("saturn.core.Protein",value219); else _g.h["saturn.core.Protein"] = value219;
		var value224;
		var _g225 = new haxe.ds.StringMap();
		var value225;
		var _g226 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g226.setReserved("name","NAME"); else _g226.h["name"] = "NAME";
		value225 = _g226;
		if(__map_reserved.fields != null) _g225.setReserved("fields",value225); else _g225.h["fields"] = value225;
		var value226;
		var _g227 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g227.setReserved("name",true); else _g227.h["name"] = true;
		value226 = _g227;
		if(__map_reserved.indexes != null) _g225.setReserved("indexes",value226); else _g225.h["indexes"] = value226;
		var value227;
		var _g228 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.TextEditor"] != null) _g228.setReserved("saturn.client.programs.TextEditor",true); else _g228.h["saturn.client.programs.TextEditor"] = true;
		value227 = _g228;
		if(__map_reserved.programs != null) _g225.setReserved("programs",value227); else _g225.h["programs"] = value227;
		var value228;
		var _g229 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g229.setReserved("alias","File"); else _g229.h["alias"] = "File";
		value228 = _g229;
		if(__map_reserved.options != null) _g225.setReserved("options",value228); else _g225.h["options"] = value228;
		value224 = _g225;
		if(__map_reserved["saturn.core.TextFile"] != null) _g.setReserved("saturn.core.TextFile",value224); else _g.h["saturn.core.TextFile"] = value224;
		var value229;
		var _g230 = new haxe.ds.StringMap();
		var value230;
		var _g231 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.BasicTableViewer"] != null) _g231.setReserved("saturn.client.programs.BasicTableViewer",true); else _g231.h["saturn.client.programs.BasicTableViewer"] = true;
		value230 = _g231;
		if(__map_reserved.programs != null) _g230.setReserved("programs",value230); else _g230.h["programs"] = value230;
		var value231;
		var _g232 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g232.setReserved("alias","Results"); else _g232.h["alias"] = "Results";
		value231 = _g232;
		if(__map_reserved.options != null) _g230.setReserved("options",value231); else _g230.h["options"] = value231;
		value229 = _g230;
		if(__map_reserved["saturn.core.BasicTable"] != null) _g.setReserved("saturn.core.BasicTable",value229); else _g.h["saturn.core.BasicTable"] = value229;
		var value232;
		var _g233 = new haxe.ds.StringMap();
		var value233;
		var _g234 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ConstructDesigner"] != null) _g234.setReserved("saturn.client.programs.ConstructDesigner",false); else _g234.h["saturn.client.programs.ConstructDesigner"] = false;
		value233 = _g234;
		if(__map_reserved.programs != null) _g233.setReserved("programs",value233); else _g233.h["programs"] = value233;
		var value234;
		var _g235 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g235.setReserved("alias","Construct Design"); else _g235.h["alias"] = "Construct Design";
		value234 = _g235;
		if(__map_reserved.options != null) _g233.setReserved("options",value234); else _g233.h["options"] = value234;
		value232 = _g233;
		if(__map_reserved["saturn.core.ConstructDesignTable"] != null) _g.setReserved("saturn.core.ConstructDesignTable",value232); else _g.h["saturn.core.ConstructDesignTable"] = value232;
		var value235;
		var _g236 = new haxe.ds.StringMap();
		var value236;
		var _g237 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.PurificationHelper"] != null) _g237.setReserved("saturn.client.programs.PurificationHelper",false); else _g237.h["saturn.client.programs.PurificationHelper"] = false;
		value236 = _g237;
		if(__map_reserved.programs != null) _g236.setReserved("programs",value236); else _g236.h["programs"] = value236;
		var value237;
		var _g238 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g238.setReserved("alias","Purifiaction Helper"); else _g238.h["alias"] = "Purifiaction Helper";
		value237 = _g238;
		if(__map_reserved.options != null) _g236.setReserved("options",value237); else _g236.h["options"] = value237;
		value235 = _g236;
		if(__map_reserved["saturn.core.PurificationHelperTable"] != null) _g.setReserved("saturn.core.PurificationHelperTable",value235); else _g.h["saturn.core.PurificationHelperTable"] = value235;
		var value238;
		var _g239 = new haxe.ds.StringMap();
		var value239;
		var _g240 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.SHRNADesigner"] != null) _g240.setReserved("saturn.client.programs.SHRNADesigner",false); else _g240.h["saturn.client.programs.SHRNADesigner"] = false;
		value239 = _g240;
		if(__map_reserved.programs != null) _g239.setReserved("programs",value239); else _g239.h["programs"] = value239;
		var value240;
		var _g241 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g241.setReserved("alias","shRNA Designer"); else _g241.h["alias"] = "shRNA Designer";
		if(__map_reserved.icon != null) _g241.setReserved("icon","shrna_16.png"); else _g241.h["icon"] = "shrna_16.png";
		value240 = _g241;
		if(__map_reserved.options != null) _g239.setReserved("options",value240); else _g239.h["options"] = value240;
		value238 = _g239;
		if(__map_reserved["saturn.core.SHRNADesignTable"] != null) _g.setReserved("saturn.core.SHRNADesignTable",value238); else _g.h["saturn.core.SHRNADesignTable"] = value238;
		var value241;
		var _g242 = new haxe.ds.StringMap();
		var value242;
		var _g243 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.BasicTableViewer"] != null) _g243.setReserved("saturn.client.programs.BasicTableViewer",false); else _g243.h["saturn.client.programs.BasicTableViewer"] = false;
		value242 = _g243;
		if(__map_reserved.programs != null) _g242.setReserved("programs",value242); else _g242.h["programs"] = value242;
		var value243;
		var _g244 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g244.setReserved("alias","Table"); else _g244.h["alias"] = "Table";
		value243 = _g244;
		if(__map_reserved.options != null) _g242.setReserved("options",value243); else _g242.h["options"] = value243;
		value241 = _g242;
		if(__map_reserved["saturn.core.Table"] != null) _g.setReserved("saturn.core.Table",value241); else _g.h["saturn.core.Table"] = value241;
		var value244;
		var _g245 = new haxe.ds.StringMap();
		var value245;
		var _g246 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g246.setReserved("id","PKEY"); else _g246.h["id"] = "PKEY";
		if(__map_reserved.compoundId != null) _g246.setReserved("compoundId","COMPOUNDNAME"); else _g246.h["compoundId"] = "COMPOUNDNAME";
		if(__map_reserved.shortCompoundId != null) _g246.setReserved("shortCompoundId","COMPOUNDID"); else _g246.h["shortCompoundId"] = "COMPOUNDID";
		if(__map_reserved.supplierId != null) _g246.setReserved("supplierId","EXTERNALID"); else _g246.h["supplierId"] = "EXTERNALID";
		if(__map_reserved.sdf != null) _g246.setReserved("sdf","MOLFILE"); else _g246.h["sdf"] = "MOLFILE";
		if(__map_reserved.supplier != null) _g246.setReserved("supplier","SUPPLIER"); else _g246.h["supplier"] = "SUPPLIER";
		if(__map_reserved.description != null) _g246.setReserved("description","DESCRIPTION"); else _g246.h["description"] = "DESCRIPTION";
		if(__map_reserved.comments != null) _g246.setReserved("comments","COMMENTS"); else _g246.h["comments"] = "COMMENTS";
		if(__map_reserved.mw != null) _g246.setReserved("mw","MOLECULARWEIGHT"); else _g246.h["mw"] = "MOLECULARWEIGHT";
		if(__map_reserved.smiles != null) _g246.setReserved("smiles","SMILES"); else _g246.h["smiles"] = "SMILES";
		if(__map_reserved.datestamp != null) _g246.setReserved("datestamp","DATESTAMP"); else _g246.h["datestamp"] = "DATESTAMP";
		if(__map_reserved.person != null) _g246.setReserved("person","PERSON"); else _g246.h["person"] = "PERSON";
		value245 = _g246;
		if(__map_reserved.fields != null) _g245.setReserved("fields",value245); else _g245.h["fields"] = value245;
		var value246;
		var _g247 = new haxe.ds.StringMap();
		if(__map_reserved.compoundId != null) _g247.setReserved("compoundId",false); else _g247.h["compoundId"] = false;
		if(__map_reserved.id != null) _g247.setReserved("id",true); else _g247.h["id"] = true;
		value246 = _g247;
		if(__map_reserved.indexes != null) _g245.setReserved("indexes",value246); else _g245.h["indexes"] = value246;
		var value247;
		var _g248 = new haxe.ds.StringMap();
		if(__map_reserved.compoundId != null) _g248.setReserved("compoundId",null); else _g248.h["compoundId"] = null;
		if(__map_reserved.shortCompoundId != null) _g248.setReserved("shortCompoundId",null); else _g248.h["shortCompoundId"] = null;
		if(__map_reserved.supplierId != null) _g248.setReserved("supplierId",null); else _g248.h["supplierId"] = null;
		if(__map_reserved.supplier != null) _g248.setReserved("supplier",null); else _g248.h["supplier"] = null;
		value247 = _g248;
		if(__map_reserved.search != null) _g245.setReserved("search",value247); else _g245.h["search"] = value247;
		var value248;
		var _g249 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g249.setReserved("schema","SGC"); else _g249.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g249.setReserved("name","SGCCOMPOUND"); else _g249.h["name"] = "SGCCOMPOUND";
		value248 = _g249;
		if(__map_reserved.table_info != null) _g245.setReserved("table_info",value248); else _g245.h["table_info"] = value248;
		var value249;
		var _g250 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g250.setReserved("id_pattern","^\\w{5}\\d{4}"); else _g250.h["id_pattern"] = "^\\w{5}\\d{4}";
		if(__map_reserved.workspace_wrapper != null) _g250.setReserved("workspace_wrapper","saturn.client.workspace.CompoundWO"); else _g250.h["workspace_wrapper"] = "saturn.client.workspace.CompoundWO";
		if(__map_reserved.icon != null) _g250.setReserved("icon","compound_16.png"); else _g250.h["icon"] = "compound_16.png";
		if(__map_reserved.alias != null) _g250.setReserved("alias","Compounds"); else _g250.h["alias"] = "Compounds";
		value249 = _g250;
		if(__map_reserved.options != null) _g245.setReserved("options",value249); else _g245.h["options"] = value249;
		var value250;
		var _g251 = new haxe.ds.StringMap();
		if(__map_reserved["Global ID"] != null) _g251.setReserved("Global ID","compoundId"); else _g251.h["Global ID"] = "compoundId";
		if(__map_reserved["Oxford ID"] != null) _g251.setReserved("Oxford ID","shortCompoundId"); else _g251.h["Oxford ID"] = "shortCompoundId";
		if(__map_reserved["Supplier ID"] != null) _g251.setReserved("Supplier ID","supplierId"); else _g251.h["Supplier ID"] = "supplierId";
		if(__map_reserved.Supplier != null) _g251.setReserved("Supplier","supplier"); else _g251.h["Supplier"] = "supplier";
		if(__map_reserved.Description != null) _g251.setReserved("Description","description"); else _g251.h["Description"] = "description";
		if(__map_reserved.Comments != null) _g251.setReserved("Comments","comments"); else _g251.h["Comments"] = "comments";
		if(__map_reserved.MW != null) _g251.setReserved("MW","mw"); else _g251.h["MW"] = "mw";
		if(__map_reserved.Date != null) _g251.setReserved("Date","datestamp"); else _g251.h["Date"] = "datestamp";
		if(__map_reserved.Person != null) _g251.setReserved("Person","person"); else _g251.h["Person"] = "person";
		if(__map_reserved.smiles != null) _g251.setReserved("smiles","smiles"); else _g251.h["smiles"] = "smiles";
		value250 = _g251;
		if(__map_reserved.model != null) _g245.setReserved("model",value250); else _g245.h["model"] = value250;
		var value251;
		var _g252 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.CompoundViewer"] != null) _g252.setReserved("saturn.client.programs.CompoundViewer",true); else _g252.h["saturn.client.programs.CompoundViewer"] = true;
		value251 = _g252;
		if(__map_reserved.programs != null) _g245.setReserved("programs",value251); else _g245.h["programs"] = value251;
		value244 = _g245;
		if(__map_reserved["saturn.core.domain.Compound"] != null) _g.setReserved("saturn.core.domain.Compound",value244); else _g.h["saturn.core.domain.Compound"] = value244;
		var value252;
		var _g253 = new haxe.ds.StringMap();
		var value253;
		var _g254 = new haxe.ds.StringMap();
		var value254;
		var _g255 = new haxe.ds.StringMap();
		if(__map_reserved.SGC != null) _g255.setReserved("SGC",true); else _g255.h["SGC"] = true;
		value254 = _g255;
		_g254.set("flags",value254);
		value253 = _g254;
		if(__map_reserved.options != null) _g253.setReserved("options",value253); else _g253.h["options"] = value253;
		value252 = _g253;
		if(__map_reserved["saturn.app.SaturnClient"] != null) _g.setReserved("saturn.app.SaturnClient",value252); else _g.h["saturn.app.SaturnClient"] = value252;
		var value255;
		var _g256 = new haxe.ds.StringMap();
		var value256;
		var _g257 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g257.setReserved("id","PKEY"); else _g257.h["id"] = "PKEY";
		if(__map_reserved.username != null) _g257.setReserved("username","USERID"); else _g257.h["username"] = "USERID";
		if(__map_reserved.fullname != null) _g257.setReserved("fullname","FULLNAME"); else _g257.h["fullname"] = "FULLNAME";
		value256 = _g257;
		if(__map_reserved.fields != null) _g256.setReserved("fields",value256); else _g256.h["fields"] = value256;
		var value257;
		var _g258 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g258.setReserved("id",true); else _g258.h["id"] = true;
		if(__map_reserved.username != null) _g258.setReserved("username",false); else _g258.h["username"] = false;
		value257 = _g258;
		if(__map_reserved.indexes != null) _g256.setReserved("indexes",value257); else _g256.h["indexes"] = value257;
		var value258;
		var _g259 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g259.setReserved("schema","HIVE"); else _g259.h["schema"] = "HIVE";
		if(__map_reserved.name != null) _g259.setReserved("name","USER_DETAILS"); else _g259.h["name"] = "USER_DETAILS";
		value258 = _g259;
		if(__map_reserved.table_info != null) _g256.setReserved("table_info",value258); else _g256.h["table_info"] = value258;
		value255 = _g256;
		if(__map_reserved["saturn.core.User"] != null) _g.setReserved("saturn.core.User",value255); else _g.h["saturn.core.User"] = value255;
		var value259;
		var _g260 = new haxe.ds.StringMap();
		var value260;
		var _g261 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g261.setReserved("id","PKEY"); else _g261.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g261.setReserved("name","NAME"); else _g261.h["name"] = "NAME";
		value260 = _g261;
		if(__map_reserved.fields != null) _g260.setReserved("fields",value260); else _g260.h["fields"] = value260;
		var value261;
		var _g262 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g262.setReserved("id",true); else _g262.h["id"] = true;
		if(__map_reserved.name != null) _g262.setReserved("name",false); else _g262.h["name"] = false;
		value261 = _g262;
		if(__map_reserved.index != null) _g260.setReserved("index",value261); else _g260.h["index"] = value261;
		var value262;
		var _g263 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g263.setReserved("schema","SGC"); else _g263.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g263.setReserved("name","SATURNPERMISSION"); else _g263.h["name"] = "SATURNPERMISSION";
		value262 = _g263;
		if(__map_reserved.table_info != null) _g260.setReserved("table_info",value262); else _g260.h["table_info"] = value262;
		value259 = _g260;
		if(__map_reserved["saturn.core.Permission"] != null) _g.setReserved("saturn.core.Permission",value259); else _g.h["saturn.core.Permission"] = value259;
		var value263;
		var _g264 = new haxe.ds.StringMap();
		var value264;
		var _g265 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g265.setReserved("id","PKEY"); else _g265.h["id"] = "PKEY";
		if(__map_reserved.permissionId != null) _g265.setReserved("permissionId","PERMISSIONID"); else _g265.h["permissionId"] = "PERMISSIONID";
		if(__map_reserved.userId != null) _g265.setReserved("userId","USERID"); else _g265.h["userId"] = "USERID";
		value264 = _g265;
		if(__map_reserved.fields != null) _g264.setReserved("fields",value264); else _g264.h["fields"] = value264;
		var value265;
		var _g266 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g266.setReserved("id",true); else _g266.h["id"] = true;
		value265 = _g266;
		if(__map_reserved.index != null) _g264.setReserved("index",value265); else _g264.h["index"] = value265;
		var value266;
		var _g267 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g267.setReserved("schema","SGC"); else _g267.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g267.setReserved("name","SATURNUSER_TO_PERMISSION"); else _g267.h["name"] = "SATURNUSER_TO_PERMISSION";
		value266 = _g267;
		if(__map_reserved.table_info != null) _g264.setReserved("table_info",value266); else _g264.h["table_info"] = value266;
		value263 = _g264;
		if(__map_reserved["saturn.core.UserToPermission"] != null) _g.setReserved("saturn.core.UserToPermission",value263); else _g.h["saturn.core.UserToPermission"] = value263;
		var value267;
		var _g268 = new haxe.ds.StringMap();
		var value268;
		var _g269 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g269.setReserved("id","PKEY"); else _g269.h["id"] = "PKEY";
		if(__map_reserved.userName != null) _g269.setReserved("userName","USERNAME"); else _g269.h["userName"] = "USERNAME";
		if(__map_reserved.isPublic != null) _g269.setReserved("isPublic","ISPUBLIC"); else _g269.h["isPublic"] = "ISPUBLIC";
		if(__map_reserved.sessionContent != null) _g269.setReserved("sessionContent","SESSIONCONTENTS"); else _g269.h["sessionContent"] = "SESSIONCONTENTS";
		if(__map_reserved.sessionName != null) _g269.setReserved("sessionName","SESSIONNAME"); else _g269.h["sessionName"] = "SESSIONNAME";
		value268 = _g269;
		if(__map_reserved.fields != null) _g268.setReserved("fields",value268); else _g268.h["fields"] = value268;
		var value269;
		var _g270 = new haxe.ds.StringMap();
		if(__map_reserved.sessionName != null) _g270.setReserved("sessionName",false); else _g270.h["sessionName"] = false;
		if(__map_reserved.id != null) _g270.setReserved("id",true); else _g270.h["id"] = true;
		value269 = _g270;
		if(__map_reserved.indexes != null) _g268.setReserved("indexes",value269); else _g268.h["indexes"] = value269;
		var value270;
		var _g271 = new haxe.ds.StringMap();
		if(__map_reserved["user.fullname"] != null) _g271.setReserved("user.fullname",null); else _g271.h["user.fullname"] = null;
		value270 = _g271;
		if(__map_reserved.search != null) _g268.setReserved("search",value270); else _g268.h["search"] = value270;
		var value271;
		var _g272 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g272.setReserved("schema","SGC"); else _g272.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g272.setReserved("name","SATURNSESSION"); else _g272.h["name"] = "SATURNSESSION";
		value271 = _g272;
		if(__map_reserved.table_info != null) _g268.setReserved("table_info",value271); else _g268.h["table_info"] = value271;
		var value272;
		var _g273 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g273.setReserved("alias","Session"); else _g273.h["alias"] = "Session";
		if(__map_reserved.auto_activate != null) _g273.setReserved("auto_activate","3"); else _g273.h["auto_activate"] = "3";
		var value273;
		var _g274 = new haxe.ds.StringMap();
		if(__map_reserved.user_constraint_field != null) _g274.setReserved("user_constraint_field","userName"); else _g274.h["user_constraint_field"] = "userName";
		if(__map_reserved.public_constraint_field != null) _g274.setReserved("public_constraint_field","isPublic"); else _g274.h["public_constraint_field"] = "isPublic";
		value273 = _g274;
		_g273.set("constraints",value273);
		var value274;
		var _g275 = new haxe.ds.StringMap();
		var value275;
		var _g276 = new haxe.ds.StringMap();
		var value276;
		var _g277 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g277.setReserved("user_suffix",""); else _g277.h["user_suffix"] = "";
		if(__map_reserved["function"] != null) _g277.setReserved("function","saturn.core.domain.SaturnSession.load"); else _g277.h["function"] = "saturn.core.domain.SaturnSession.load";
		value276 = _g277;
		if(__map_reserved.DEFAULT != null) _g276.setReserved("DEFAULT",value276); else _g276.h["DEFAULT"] = value276;
		value275 = _g276;
		if(__map_reserved.search_bar != null) _g275.setReserved("search_bar",value275); else _g275.h["search_bar"] = value275;
		value274 = _g275;
		_g273.set("actions",value274);
		value272 = _g273;
		if(__map_reserved.options != null) _g268.setReserved("options",value272); else _g268.h["options"] = value272;
		var value277;
		var _g278 = new haxe.ds.StringMap();
		if(__map_reserved.USERNAME != null) _g278.setReserved("USERNAME","insert.username"); else _g278.h["USERNAME"] = "insert.username";
		value277 = _g278;
		if(__map_reserved.auto_functions != null) _g268.setReserved("auto_functions",value277); else _g268.h["auto_functions"] = value277;
		var value278;
		var _g279 = new haxe.ds.StringMap();
		var value279;
		var _g280 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g280.setReserved("field","userName"); else _g280.h["field"] = "userName";
		if(__map_reserved["class"] != null) _g280.setReserved("class","saturn.core.User"); else _g280.h["class"] = "saturn.core.User";
		if(__map_reserved.fk_field != null) _g280.setReserved("fk_field","username"); else _g280.h["fk_field"] = "username";
		value279 = _g280;
		_g279.set("user",value279);
		value278 = _g279;
		if(__map_reserved["fields.synthetic"] != null) _g268.setReserved("fields.synthetic",value278); else _g268.h["fields.synthetic"] = value278;
		value267 = _g268;
		if(__map_reserved["saturn.core.domain.SaturnSession"] != null) _g.setReserved("saturn.core.domain.SaturnSession",value267); else _g.h["saturn.core.domain.SaturnSession"] = value267;
		this.models = _g;
	}
	,__class__: saturn.db.mapping.KISGC
};
saturn.db.mapping.SGC = $hxClasses["saturn.db.mapping.SGC"] = function() {
	this.buildModels();
};
saturn.db.mapping.SGC.__name__ = ["saturn","db","mapping","SGC"];
saturn.db.mapping.SGC.getNextAvailableId = function(clazz,value,db,cb) {
};
saturn.db.mapping.SGC.prototype = {
	models: null
	,buildModels: function() {
		var _g = new haxe.ds.StringMap();
		var value;
		var _g1 = new haxe.ds.StringMap();
		var value1;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g2.setReserved("constructId","CONSTRUCT_ID"); else _g2.h["constructId"] = "CONSTRUCT_ID";
		if(__map_reserved.id != null) _g2.setReserved("id","PKEY"); else _g2.h["id"] = "PKEY";
		if(__map_reserved.proteinSeq != null) _g2.setReserved("proteinSeq","CONSTRUCTPROTSEQ"); else _g2.h["proteinSeq"] = "CONSTRUCTPROTSEQ";
		if(__map_reserved.proteinSeqNoTag != null) _g2.setReserved("proteinSeqNoTag","CONSTRUCTPROTSEQNOTAG"); else _g2.h["proteinSeqNoTag"] = "CONSTRUCTPROTSEQNOTAG";
		if(__map_reserved.dnaSeq != null) _g2.setReserved("dnaSeq","CONSTRUCTDNASEQ"); else _g2.h["dnaSeq"] = "CONSTRUCTDNASEQ";
		if(__map_reserved.docId != null) _g2.setReserved("docId","ELNEXP"); else _g2.h["docId"] = "ELNEXP";
		if(__map_reserved.vectorId != null) _g2.setReserved("vectorId","SGCVECTOR_PKEY"); else _g2.h["vectorId"] = "SGCVECTOR_PKEY";
		if(__map_reserved.alleleId != null) _g2.setReserved("alleleId","SGCALLELE_PKEY"); else _g2.h["alleleId"] = "SGCALLELE_PKEY";
		if(__map_reserved.res1Id != null) _g2.setReserved("res1Id","SGCRESTRICTENZ1_PKEY"); else _g2.h["res1Id"] = "SGCRESTRICTENZ1_PKEY";
		if(__map_reserved.res2Id != null) _g2.setReserved("res2Id","SGCRESTRICTENZ2_PKEY"); else _g2.h["res2Id"] = "SGCRESTRICTENZ2_PKEY";
		if(__map_reserved.constructPlateId != null) _g2.setReserved("constructPlateId","SGCCONSTRUCTPLATE_PKEY"); else _g2.h["constructPlateId"] = "SGCCONSTRUCTPLATE_PKEY";
		if(__map_reserved.wellId != null) _g2.setReserved("wellId","WELLID"); else _g2.h["wellId"] = "WELLID";
		if(__map_reserved.expectedMass != null) _g2.setReserved("expectedMass","EXPECTEDMASS"); else _g2.h["expectedMass"] = "EXPECTEDMASS";
		if(__map_reserved.expectedMassNoTag != null) _g2.setReserved("expectedMassNoTag","EXPETCEDMASSNOTAG"); else _g2.h["expectedMassNoTag"] = "EXPETCEDMASSNOTAG";
		if(__map_reserved.status != null) _g2.setReserved("status","STATUS"); else _g2.h["status"] = "STATUS";
		if(__map_reserved.location != null) _g2.setReserved("location","SGCLOCATION"); else _g2.h["location"] = "SGCLOCATION";
		if(__map_reserved.elnId != null) _g2.setReserved("elnId","ELNEXP"); else _g2.h["elnId"] = "ELNEXP";
		if(__map_reserved.constructComments != null) _g2.setReserved("constructComments","CONSTRUCTCOMMENTS"); else _g2.h["constructComments"] = "CONSTRUCTCOMMENTS";
		if(__map_reserved.person != null) _g2.setReserved("person","PERSON"); else _g2.h["person"] = "PERSON";
		if(__map_reserved.constructStart != null) _g2.setReserved("constructStart","CONSTRUCTSTART"); else _g2.h["constructStart"] = "CONSTRUCTSTART";
		if(__map_reserved.constructStop != null) _g2.setReserved("constructStop","CONSTRUCTSTOP"); else _g2.h["constructStop"] = "CONSTRUCTSTOP";
		value1 = _g2;
		if(__map_reserved.fields != null) _g1.setReserved("fields",value1); else _g1.h["fields"] = value1;
		var value2;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.status != null) _g3.setReserved("status","In progress"); else _g3.h["status"] = "In progress";
		value2 = _g3;
		if(__map_reserved.defaults != null) _g1.setReserved("defaults",value2); else _g1.h["defaults"] = value2;
		var value3;
		var _g4 = new haxe.ds.StringMap();
		if(__map_reserved.PERSON != null) _g4.setReserved("PERSON","insert.username"); else _g4.h["PERSON"] = "insert.username";
		value3 = _g4;
		if(__map_reserved.auto_functions != null) _g1.setReserved("auto_functions",value3); else _g1.h["auto_functions"] = value3;
		var value4;
		var _g5 = new haxe.ds.StringMap();
		if(__map_reserved.wellId != null) _g5.setReserved("wellId","1"); else _g5.h["wellId"] = "1";
		if(__map_reserved.constructPlateId != null) _g5.setReserved("constructPlateId","1"); else _g5.h["constructPlateId"] = "1";
		if(__map_reserved.constructId != null) _g5.setReserved("constructId","1"); else _g5.h["constructId"] = "1";
		if(__map_reserved.alleleId != null) _g5.setReserved("alleleId","1"); else _g5.h["alleleId"] = "1";
		if(__map_reserved.vectorId != null) _g5.setReserved("vectorId","1"); else _g5.h["vectorId"] = "1";
		value4 = _g5;
		if(__map_reserved.required != null) _g1.setReserved("required",value4); else _g1.h["required"] = value4;
		var value5;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g6.setReserved("constructId",false); else _g6.h["constructId"] = false;
		if(__map_reserved.id != null) _g6.setReserved("id",true); else _g6.h["id"] = true;
		value5 = _g6;
		if(__map_reserved.indexes != null) _g1.setReserved("indexes",value5); else _g1.h["indexes"] = value5;
		var value6;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved["Construct ID"] != null) _g7.setReserved("Construct ID","constructId"); else _g7.h["Construct ID"] = "constructId";
		if(__map_reserved["Construct Plate"] != null) _g7.setReserved("Construct Plate","constructPlate.plateName"); else _g7.h["Construct Plate"] = "constructPlate.plateName";
		if(__map_reserved["Well ID"] != null) _g7.setReserved("Well ID","wellId"); else _g7.h["Well ID"] = "wellId";
		if(__map_reserved["Vector ID"] != null) _g7.setReserved("Vector ID","vector.vectorId"); else _g7.h["Vector ID"] = "vector.vectorId";
		if(__map_reserved["Allele ID"] != null) _g7.setReserved("Allele ID","allele.alleleId"); else _g7.h["Allele ID"] = "allele.alleleId";
		if(__map_reserved.Status != null) _g7.setReserved("Status","status"); else _g7.h["Status"] = "status";
		if(__map_reserved["Protein Sequence"] != null) _g7.setReserved("Protein Sequence","proteinSeq"); else _g7.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved["Expected Mass"] != null) _g7.setReserved("Expected Mass","expectedMass"); else _g7.h["Expected Mass"] = "expectedMass";
		if(__map_reserved["Restriction Site 1"] != null) _g7.setReserved("Restriction Site 1","res1.enzymeName"); else _g7.h["Restriction Site 1"] = "res1.enzymeName";
		if(__map_reserved["Restriction Site 2"] != null) _g7.setReserved("Restriction Site 2","res2.enzymeName"); else _g7.h["Restriction Site 2"] = "res2.enzymeName";
		if(__map_reserved["Protein Sequence (No Tag)"] != null) _g7.setReserved("Protein Sequence (No Tag)","proteinSeqNoTag"); else _g7.h["Protein Sequence (No Tag)"] = "proteinSeqNoTag";
		if(__map_reserved["Expected Mass (No Tag)"] != null) _g7.setReserved("Expected Mass (No Tag)","expectedMassNoTag"); else _g7.h["Expected Mass (No Tag)"] = "expectedMassNoTag";
		if(__map_reserved["Construct DNA Sequence"] != null) _g7.setReserved("Construct DNA Sequence","dnaSeq"); else _g7.h["Construct DNA Sequence"] = "dnaSeq";
		if(__map_reserved.Location != null) _g7.setReserved("Location","location"); else _g7.h["Location"] = "location";
		if(__map_reserved["ELN ID"] != null) _g7.setReserved("ELN ID","elnId"); else _g7.h["ELN ID"] = "elnId";
		if(__map_reserved["Construct Comments"] != null) _g7.setReserved("Construct Comments","constructComments"); else _g7.h["Construct Comments"] = "constructComments";
		if(__map_reserved.Creator != null) _g7.setReserved("Creator","person"); else _g7.h["Creator"] = "person";
		if(__map_reserved["Construct Start"] != null) _g7.setReserved("Construct Start","constructStart"); else _g7.h["Construct Start"] = "constructStart";
		if(__map_reserved["Construct Stop"] != null) _g7.setReserved("Construct Stop","constructStop"); else _g7.h["Construct Stop"] = "constructStop";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g7.setReserved("__HIDDEN__PKEY__","id"); else _g7.h["__HIDDEN__PKEY__"] = "id";
		value6 = _g7;
		if(__map_reserved.model != null) _g1.setReserved("model",value6); else _g1.h["model"] = value6;
		var value7;
		var _g8 = new haxe.ds.StringMap();
		var value8;
		var _g9 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g9.setReserved("field","alleleId"); else _g9.h["field"] = "alleleId";
		if(__map_reserved["class"] != null) _g9.setReserved("class","saturn.core.domain.SgcAllele"); else _g9.h["class"] = "saturn.core.domain.SgcAllele";
		if(__map_reserved.fk_field != null) _g9.setReserved("fk_field","id"); else _g9.h["fk_field"] = "id";
		value8 = _g9;
		_g8.set("allele",value8);
		var value9;
		var _g10 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g10.setReserved("field","vectorId"); else _g10.h["field"] = "vectorId";
		if(__map_reserved["class"] != null) _g10.setReserved("class","saturn.core.domain.SgcVector"); else _g10.h["class"] = "saturn.core.domain.SgcVector";
		if(__map_reserved.fk_field != null) _g10.setReserved("fk_field","id"); else _g10.h["fk_field"] = "id";
		value9 = _g10;
		_g8.set("vector",value9);
		var value10;
		var _g11 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g11.setReserved("field","res1Id"); else _g11.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g11.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g11.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g11.setReserved("fk_field","id"); else _g11.h["fk_field"] = "id";
		value10 = _g11;
		_g8.set("res1",value10);
		var value11;
		var _g12 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g12.setReserved("field","res2Id"); else _g12.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g12.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g12.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g12.setReserved("fk_field","id"); else _g12.h["fk_field"] = "id";
		value11 = _g12;
		_g8.set("res2",value11);
		var value12;
		var _g13 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g13.setReserved("field","constructPlateId"); else _g13.h["field"] = "constructPlateId";
		if(__map_reserved["class"] != null) _g13.setReserved("class","saturn.core.domain.SgcConstructPlate"); else _g13.h["class"] = "saturn.core.domain.SgcConstructPlate";
		if(__map_reserved.fk_field != null) _g13.setReserved("fk_field","id"); else _g13.h["fk_field"] = "id";
		value12 = _g13;
		_g8.set("constructPlate",value12);
		var value13;
		var _g14 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g14.setReserved("field","proteinSeq"); else _g14.h["field"] = "proteinSeq";
		if(__map_reserved["class"] != null) _g14.setReserved("class","saturn.core.Protein"); else _g14.h["class"] = "saturn.core.Protein";
		if(__map_reserved.fk_field != null) _g14.setReserved("fk_field",null); else _g14.h["fk_field"] = null;
		value13 = _g14;
		_g8.set("proteinSequenceObj",value13);
		var value14;
		var _g15 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g15.setReserved("field","proteinSeqNoTag"); else _g15.h["field"] = "proteinSeqNoTag";
		if(__map_reserved["class"] != null) _g15.setReserved("class","saturn.core.Protein"); else _g15.h["class"] = "saturn.core.Protein";
		if(__map_reserved.fk_field != null) _g15.setReserved("fk_field",null); else _g15.h["fk_field"] = null;
		value14 = _g15;
		_g8.set("proteinSequenceNoTagObj",value14);
		value7 = _g8;
		if(__map_reserved["fields.synthetic"] != null) _g1.setReserved("fields.synthetic",value7); else _g1.h["fields.synthetic"] = value7;
		var value15;
		var _g16 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g16.setReserved("schema","SGC"); else _g16.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g16.setReserved("name","CONSTRUCT"); else _g16.h["name"] = "CONSTRUCT";
		value15 = _g16;
		if(__map_reserved.table_info != null) _g1.setReserved("table_info",value15); else _g1.h["table_info"] = value15;
		var value16;
		var _g17 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g17.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g17.h["saturn.client.programs.DNASequenceEditor"] = true;
		value16 = _g17;
		if(__map_reserved.programs != null) _g1.setReserved("programs",value16); else _g1.h["programs"] = value16;
		var value17;
		var _g18 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g18.setReserved("constructId",true); else _g18.h["constructId"] = true;
		value17 = _g18;
		if(__map_reserved.search != null) _g1.setReserved("search",value17); else _g1.h["search"] = value17;
		var value18;
		var _g19 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g19.setReserved("id_pattern","-c"); else _g19.h["id_pattern"] = "-c";
		if(__map_reserved.alias != null) _g19.setReserved("alias","Construct"); else _g19.h["alias"] = "Construct";
		if(__map_reserved["file.new.label"] != null) _g19.setReserved("file.new.label","Construct"); else _g19.h["file.new.label"] = "Construct";
		if(__map_reserved.icon != null) _g19.setReserved("icon","dna_conical_16.png"); else _g19.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g19.setReserved("auto_activate","3"); else _g19.h["auto_activate"] = "3";
		var value19;
		var _g20 = new haxe.ds.StringMap();
		var value20;
		var _g21 = new haxe.ds.StringMap();
		var value21;
		var _g22 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g22.setReserved("user_suffix","Protein"); else _g22.h["user_suffix"] = "Protein";
		if(__map_reserved["function"] != null) _g22.setReserved("function","saturn.core.domain.SgcConstruct.loadProtein"); else _g22.h["function"] = "saturn.core.domain.SgcConstruct.loadProtein";
		if(__map_reserved.icon != null) _g22.setReserved("icon","structure_16.png"); else _g22.h["icon"] = "structure_16.png";
		value21 = _g22;
		if(__map_reserved.protein != null) _g21.setReserved("protein",value21); else _g21.h["protein"] = value21;
		var value22;
		var _g23 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g23.setReserved("user_suffix","Protein No Tag"); else _g23.h["user_suffix"] = "Protein No Tag";
		if(__map_reserved["function"] != null) _g23.setReserved("function","saturn.core.domain.SgcConstruct.loadProteinNoTag"); else _g23.h["function"] = "saturn.core.domain.SgcConstruct.loadProteinNoTag";
		if(__map_reserved.icon != null) _g23.setReserved("icon","structure_16.png"); else _g23.h["icon"] = "structure_16.png";
		value22 = _g23;
		if(__map_reserved.proteinNoTag != null) _g21.setReserved("proteinNoTag",value22); else _g21.h["proteinNoTag"] = value22;
		value20 = _g21;
		if(__map_reserved.search_bar != null) _g20.setReserved("search_bar",value20); else _g20.h["search_bar"] = value20;
		value19 = _g20;
		_g19.set("actions",value19);
		value18 = _g19;
		if(__map_reserved.options != null) _g1.setReserved("options",value18); else _g1.h["options"] = value18;
		value = _g1;
		if(__map_reserved["saturn.core.domain.SgcConstruct"] != null) _g.setReserved("saturn.core.domain.SgcConstruct",value); else _g.h["saturn.core.domain.SgcConstruct"] = value;
		var value23;
		var _g24 = new haxe.ds.StringMap();
		var value24;
		var _g25 = new haxe.ds.StringMap();
		if(__map_reserved.constructPkey != null) _g25.setReserved("constructPkey","SGCCONSTRUCT_PKEY"); else _g25.h["constructPkey"] = "SGCCONSTRUCT_PKEY";
		if(__map_reserved.status != null) _g25.setReserved("status","STATUS"); else _g25.h["status"] = "STATUS";
		value24 = _g25;
		if(__map_reserved.fields != null) _g24.setReserved("fields",value24); else _g24.h["fields"] = value24;
		var value25;
		var _g26 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g26.setReserved("schema","SGC"); else _g26.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g26.setReserved("name","CONSTR_STATUS_SNAPSHOT"); else _g26.h["name"] = "CONSTR_STATUS_SNAPSHOT";
		value25 = _g26;
		if(__map_reserved.table_info != null) _g24.setReserved("table_info",value25); else _g24.h["table_info"] = value25;
		var value26;
		var _g27 = new haxe.ds.StringMap();
		if(__map_reserved.constructPkey != null) _g27.setReserved("constructPkey",true); else _g27.h["constructPkey"] = true;
		value26 = _g27;
		if(__map_reserved.indexes != null) _g24.setReserved("indexes",value26); else _g24.h["indexes"] = value26;
		value23 = _g24;
		if(__map_reserved["saturn.core.domain.SgcConstructStatus"] != null) _g.setReserved("saturn.core.domain.SgcConstructStatus",value23); else _g.h["saturn.core.domain.SgcConstructStatus"] = value23;
		var value27;
		var _g28 = new haxe.ds.StringMap();
		var value28;
		var _g29 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g29.setReserved("alleleId","ALLELE_ID"); else _g29.h["alleleId"] = "ALLELE_ID";
		if(__map_reserved.allelePlateId != null) _g29.setReserved("allelePlateId","SGCPLATE_PKEY"); else _g29.h["allelePlateId"] = "SGCPLATE_PKEY";
		if(__map_reserved.id != null) _g29.setReserved("id","PKEY"); else _g29.h["id"] = "PKEY";
		if(__map_reserved.entryCloneId != null) _g29.setReserved("entryCloneId","SGCENTRYCLONE_PKEY"); else _g29.h["entryCloneId"] = "SGCENTRYCLONE_PKEY";
		if(__map_reserved.forwardPrimerId != null) _g29.setReserved("forwardPrimerId","SGCPRIMER5_PKEY"); else _g29.h["forwardPrimerId"] = "SGCPRIMER5_PKEY";
		if(__map_reserved.reversePrimerId != null) _g29.setReserved("reversePrimerId","SGCPRIMER3_PKEY"); else _g29.h["reversePrimerId"] = "SGCPRIMER3_PKEY";
		if(__map_reserved.dnaSeq != null) _g29.setReserved("dnaSeq","ALLELESEQUENCERAW"); else _g29.h["dnaSeq"] = "ALLELESEQUENCERAW";
		if(__map_reserved.proteinSeq != null) _g29.setReserved("proteinSeq","ALLELEPROTSEQ"); else _g29.h["proteinSeq"] = "ALLELEPROTSEQ";
		if(__map_reserved.status != null) _g29.setReserved("status","ALLELE_STATUS"); else _g29.h["status"] = "ALLELE_STATUS";
		if(__map_reserved.location != null) _g29.setReserved("location","SGCLOCATION"); else _g29.h["location"] = "SGCLOCATION";
		if(__map_reserved.comments != null) _g29.setReserved("comments","ALLELECOMMENTS"); else _g29.h["comments"] = "ALLELECOMMENTS";
		if(__map_reserved.elnId != null) _g29.setReserved("elnId","ELNEXP"); else _g29.h["elnId"] = "ELNEXP";
		if(__map_reserved.dateStamp != null) _g29.setReserved("dateStamp","DATESTAMP"); else _g29.h["dateStamp"] = "DATESTAMP";
		if(__map_reserved.person != null) _g29.setReserved("person","PERSON"); else _g29.h["person"] = "PERSON";
		if(__map_reserved.plateWell != null) _g29.setReserved("plateWell","PLATEWELL"); else _g29.h["plateWell"] = "PLATEWELL";
		if(__map_reserved.dnaSeqLen != null) _g29.setReserved("dnaSeqLen","ALLELESEQLENGTH"); else _g29.h["dnaSeqLen"] = "ALLELESEQLENGTH";
		if(__map_reserved.complex != null) _g29.setReserved("complex","COMPLEX"); else _g29.h["complex"] = "COMPLEX";
		if(__map_reserved.domainSummary != null) _g29.setReserved("domainSummary","DOMAINSUMMARY"); else _g29.h["domainSummary"] = "DOMAINSUMMARY";
		if(__map_reserved.domainStartDelta != null) _g29.setReserved("domainStartDelta","DOMAINSTARTDELTA"); else _g29.h["domainStartDelta"] = "DOMAINSTARTDELTA";
		if(__map_reserved.domainStopDelta != null) _g29.setReserved("domainStopDelta","DOMAINSTOPDELTA"); else _g29.h["domainStopDelta"] = "DOMAINSTOPDELTA";
		if(__map_reserved.containsPharmaDomain != null) _g29.setReserved("containsPharmaDomain","CONTAINSPHARMADOMAIN"); else _g29.h["containsPharmaDomain"] = "CONTAINSPHARMADOMAIN";
		if(__map_reserved.domainSummaryLong != null) _g29.setReserved("domainSummaryLong","DOMAINSUMMARYLONG"); else _g29.h["domainSummaryLong"] = "DOMAINSUMMARYLONG";
		if(__map_reserved.impPI != null) _g29.setReserved("impPI","IMPPI"); else _g29.h["impPI"] = "IMPPI";
		if(__map_reserved.alleleStatus != null) _g29.setReserved("alleleStatus","ALLELE_STATUS"); else _g29.h["alleleStatus"] = "ALLELE_STATUS";
		value28 = _g29;
		if(__map_reserved.fields != null) _g28.setReserved("fields",value28); else _g28.h["fields"] = value28;
		var value29;
		var _g30 = new haxe.ds.StringMap();
		if(__map_reserved.status != null) _g30.setReserved("status","In process"); else _g30.h["status"] = "In process";
		value29 = _g30;
		if(__map_reserved.defaults != null) _g28.setReserved("defaults",value29); else _g28.h["defaults"] = value29;
		var value30;
		var _g31 = new haxe.ds.StringMap();
		if(__map_reserved["Allele ID"] != null) _g31.setReserved("Allele ID","alleleId"); else _g31.h["Allele ID"] = "alleleId";
		if(__map_reserved.Plate != null) _g31.setReserved("Plate","plate.plateName"); else _g31.h["Plate"] = "plate.plateName";
		if(__map_reserved["Entry Clone ID"] != null) _g31.setReserved("Entry Clone ID","entryClone.entryCloneId"); else _g31.h["Entry Clone ID"] = "entryClone.entryCloneId";
		if(__map_reserved["Forward Primer ID"] != null) _g31.setReserved("Forward Primer ID","forwardPrimer.primerId"); else _g31.h["Forward Primer ID"] = "forwardPrimer.primerId";
		if(__map_reserved["Reverse Primer ID"] != null) _g31.setReserved("Reverse Primer ID","reversePrimer.primerId"); else _g31.h["Reverse Primer ID"] = "reversePrimer.primerId";
		if(__map_reserved["DNA Sequence"] != null) _g31.setReserved("DNA Sequence","dnaSeq"); else _g31.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved["Protein Sequence"] != null) _g31.setReserved("Protein Sequence","proteinSeq"); else _g31.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.Status != null) _g31.setReserved("Status","status"); else _g31.h["Status"] = "status";
		if(__map_reserved.Location != null) _g31.setReserved("Location","location"); else _g31.h["Location"] = "location";
		if(__map_reserved.Comments != null) _g31.setReserved("Comments","comments"); else _g31.h["Comments"] = "comments";
		if(__map_reserved["ELN ID"] != null) _g31.setReserved("ELN ID","elnId"); else _g31.h["ELN ID"] = "elnId";
		if(__map_reserved["Date Record"] != null) _g31.setReserved("Date Record","dateStamp"); else _g31.h["Date Record"] = "dateStamp";
		if(__map_reserved.Person != null) _g31.setReserved("Person","person"); else _g31.h["Person"] = "person";
		if(__map_reserved["Plate Well"] != null) _g31.setReserved("Plate Well","plateWell"); else _g31.h["Plate Well"] = "plateWell";
		if(__map_reserved["DNA Length"] != null) _g31.setReserved("DNA Length","dnaSeqLen"); else _g31.h["DNA Length"] = "dnaSeqLen";
		if(__map_reserved.Complex != null) _g31.setReserved("Complex","complex"); else _g31.h["Complex"] = "complex";
		if(__map_reserved["Domain Summary"] != null) _g31.setReserved("Domain Summary","domainSummary"); else _g31.h["Domain Summary"] = "domainSummary";
		if(__map_reserved["Domain  Start Delta"] != null) _g31.setReserved("Domain  Start Delta","domainStartDelta"); else _g31.h["Domain  Start Delta"] = "domainStartDelta";
		if(__map_reserved["Domain Stop Delta"] != null) _g31.setReserved("Domain Stop Delta","domainStopDelta"); else _g31.h["Domain Stop Delta"] = "domainStopDelta";
		if(__map_reserved["Contains Pharma Domain"] != null) _g31.setReserved("Contains Pharma Domain","containsPharmaDomain"); else _g31.h["Contains Pharma Domain"] = "containsPharmaDomain";
		if(__map_reserved["Domain Summary Long"] != null) _g31.setReserved("Domain Summary Long","domainSummaryLong"); else _g31.h["Domain Summary Long"] = "domainSummaryLong";
		if(__map_reserved["IMP PI"] != null) _g31.setReserved("IMP PI","impPI"); else _g31.h["IMP PI"] = "impPI";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g31.setReserved("__HIDDEN__PKEY__","id"); else _g31.h["__HIDDEN__PKEY__"] = "id";
		value30 = _g31;
		if(__map_reserved.model != null) _g28.setReserved("model",value30); else _g28.h["model"] = value30;
		var value31;
		var _g32 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g32.setReserved("alleleId",false); else _g32.h["alleleId"] = false;
		if(__map_reserved.id != null) _g32.setReserved("id",true); else _g32.h["id"] = true;
		value31 = _g32;
		if(__map_reserved.indexes != null) _g28.setReserved("indexes",value31); else _g28.h["indexes"] = value31;
		var value32;
		var _g33 = new haxe.ds.StringMap();
		var value33;
		var _g34 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g34.setReserved("field","entryCloneId"); else _g34.h["field"] = "entryCloneId";
		if(__map_reserved["class"] != null) _g34.setReserved("class","saturn.core.domain.SgcEntryClone"); else _g34.h["class"] = "saturn.core.domain.SgcEntryClone";
		if(__map_reserved.fk_field != null) _g34.setReserved("fk_field","id"); else _g34.h["fk_field"] = "id";
		value33 = _g34;
		_g33.set("entryClone",value33);
		var value34;
		var _g35 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g35.setReserved("field","forwardPrimerId"); else _g35.h["field"] = "forwardPrimerId";
		if(__map_reserved["class"] != null) _g35.setReserved("class","saturn.core.domain.SgcForwardPrimer"); else _g35.h["class"] = "saturn.core.domain.SgcForwardPrimer";
		if(__map_reserved.fk_field != null) _g35.setReserved("fk_field","id"); else _g35.h["fk_field"] = "id";
		value34 = _g35;
		_g33.set("forwardPrimer",value34);
		var value35;
		var _g36 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g36.setReserved("field","reversePrimerId"); else _g36.h["field"] = "reversePrimerId";
		if(__map_reserved["class"] != null) _g36.setReserved("class","saturn.core.domain.SgcReversePrimer"); else _g36.h["class"] = "saturn.core.domain.SgcReversePrimer";
		if(__map_reserved.fk_field != null) _g36.setReserved("fk_field","id"); else _g36.h["fk_field"] = "id";
		value35 = _g36;
		_g33.set("reversePrimer",value35);
		var value36;
		var _g37 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g37.setReserved("field","allelePlateId"); else _g37.h["field"] = "allelePlateId";
		if(__map_reserved["class"] != null) _g37.setReserved("class","saturn.core.domain.SgcAllelePlate"); else _g37.h["class"] = "saturn.core.domain.SgcAllelePlate";
		if(__map_reserved.fk_field != null) _g37.setReserved("fk_field","id"); else _g37.h["fk_field"] = "id";
		value36 = _g37;
		_g33.set("plate",value36);
		var value37;
		var _g38 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g38.setReserved("field","proteinSeq"); else _g38.h["field"] = "proteinSeq";
		if(__map_reserved["class"] != null) _g38.setReserved("class","saturn.core.Protein"); else _g38.h["class"] = "saturn.core.Protein";
		if(__map_reserved.fk_field != null) _g38.setReserved("fk_field",null); else _g38.h["fk_field"] = null;
		value37 = _g38;
		_g33.set("proteinSequenceObj",value37);
		value32 = _g33;
		if(__map_reserved["fields.synthetic"] != null) _g28.setReserved("fields.synthetic",value32); else _g28.h["fields.synthetic"] = value32;
		var value38;
		var _g39 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g39.setReserved("schema","SGC"); else _g39.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g39.setReserved("name","ALLELE"); else _g39.h["name"] = "ALLELE";
		value38 = _g39;
		if(__map_reserved.table_info != null) _g28.setReserved("table_info",value38); else _g28.h["table_info"] = value38;
		var value39;
		var _g40 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g40.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g40.h["saturn.client.programs.DNASequenceEditor"] = true;
		value39 = _g40;
		if(__map_reserved.programs != null) _g28.setReserved("programs",value39); else _g28.h["programs"] = value39;
		var value40;
		var _g41 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g41.setReserved("alleleId",true); else _g41.h["alleleId"] = true;
		value40 = _g41;
		if(__map_reserved.search != null) _g28.setReserved("search",value40); else _g28.h["search"] = value40;
		var value41;
		var _g42 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g42.setReserved("id_pattern","-a"); else _g42.h["id_pattern"] = "-a";
		if(__map_reserved.alias != null) _g42.setReserved("alias","Allele"); else _g42.h["alias"] = "Allele";
		if(__map_reserved["file.new.label"] != null) _g42.setReserved("file.new.label","Allele"); else _g42.h["file.new.label"] = "Allele";
		if(__map_reserved.icon != null) _g42.setReserved("icon","dna_conical_16.png"); else _g42.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g42.setReserved("auto_activate","3"); else _g42.h["auto_activate"] = "3";
		var value42;
		var _g43 = new haxe.ds.StringMap();
		var value43;
		var _g44 = new haxe.ds.StringMap();
		var value44;
		var _g45 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g45.setReserved("user_suffix","Protein"); else _g45.h["user_suffix"] = "Protein";
		if(__map_reserved["function"] != null) _g45.setReserved("function","saturn.core.domain.SgcAllele.loadProtein"); else _g45.h["function"] = "saturn.core.domain.SgcAllele.loadProtein";
		if(__map_reserved.icon != null) _g45.setReserved("icon","structure_16.png"); else _g45.h["icon"] = "structure_16.png";
		value44 = _g45;
		if(__map_reserved.protein != null) _g44.setReserved("protein",value44); else _g44.h["protein"] = value44;
		value43 = _g44;
		if(__map_reserved.search_bar != null) _g43.setReserved("search_bar",value43); else _g43.h["search_bar"] = value43;
		value42 = _g43;
		_g42.set("actions",value42);
		value41 = _g42;
		if(__map_reserved.options != null) _g28.setReserved("options",value41); else _g28.h["options"] = value41;
		value27 = _g28;
		if(__map_reserved["saturn.core.domain.SgcAllele"] != null) _g.setReserved("saturn.core.domain.SgcAllele",value27); else _g.h["saturn.core.domain.SgcAllele"] = value27;
		var value45;
		var _g46 = new haxe.ds.StringMap();
		var value46;
		var _g47 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g47.setReserved("entryCloneId","ENTRY_CLONE_ID"); else _g47.h["entryCloneId"] = "ENTRY_CLONE_ID";
		if(__map_reserved.id != null) _g47.setReserved("id","PKEY"); else _g47.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g47.setReserved("dnaSeq","DNARAWSEQUENCE"); else _g47.h["dnaSeq"] = "DNARAWSEQUENCE";
		if(__map_reserved.targetId != null) _g47.setReserved("targetId","SGCTARGET_PKEY"); else _g47.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.seqSource != null) _g47.setReserved("seqSource","SEQSOURCE"); else _g47.h["seqSource"] = "SEQSOURCE";
		if(__map_reserved.sourceId != null) _g47.setReserved("sourceId","SOURCEID"); else _g47.h["sourceId"] = "SOURCEID";
		if(__map_reserved.sequenceConfirmed != null) _g47.setReserved("sequenceConfirmed","SEQUENCECONFIRMED"); else _g47.h["sequenceConfirmed"] = "SEQUENCECONFIRMED";
		if(__map_reserved.elnId != null) _g47.setReserved("elnId","ELNEXPERIMENTID"); else _g47.h["elnId"] = "ELNEXPERIMENTID";
		value46 = _g47;
		if(__map_reserved.fields != null) _g46.setReserved("fields",value46); else _g46.h["fields"] = value46;
		var value47;
		var _g48 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g48.setReserved("entryCloneId",false); else _g48.h["entryCloneId"] = false;
		if(__map_reserved.id != null) _g48.setReserved("id",true); else _g48.h["id"] = true;
		value47 = _g48;
		if(__map_reserved.indexes != null) _g46.setReserved("indexes",value47); else _g46.h["indexes"] = value47;
		var value48;
		var _g49 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g49.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g49.h["saturn.client.programs.DNASequenceEditor"] = true;
		value48 = _g49;
		if(__map_reserved.programs != null) _g46.setReserved("programs",value48); else _g46.h["programs"] = value48;
		var value49;
		var _g50 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g50.setReserved("entryCloneId",true); else _g50.h["entryCloneId"] = true;
		value49 = _g50;
		if(__map_reserved.search != null) _g46.setReserved("search",value49); else _g46.h["search"] = value49;
		var value50;
		var _g51 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g51.setReserved("id_pattern","-s"); else _g51.h["id_pattern"] = "-s";
		var value51;
		var _g52 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g52.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g52.h["saturn.client.programs.DNASequenceEditor"] = true;
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g52.setReserved("saturn.client.programs.ProteinSequenceEditor",true); else _g52.h["saturn.client.programs.ProteinSequenceEditor"] = true;
		value51 = _g52;
		_g51.set("canSave",value51);
		if(__map_reserved.alias != null) _g51.setReserved("alias","Entry Clone"); else _g51.h["alias"] = "Entry Clone";
		if(__map_reserved["file.new.label"] != null) _g51.setReserved("file.new.label","Entry Clone"); else _g51.h["file.new.label"] = "Entry Clone";
		if(__map_reserved.icon != null) _g51.setReserved("icon","dna_conical_16.png"); else _g51.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g51.setReserved("auto_activate","3"); else _g51.h["auto_activate"] = "3";
		var value52;
		var _g53 = new haxe.ds.StringMap();
		var value53;
		var _g54 = new haxe.ds.StringMap();
		var value54;
		var _g55 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g55.setReserved("user_suffix","Translation"); else _g55.h["user_suffix"] = "Translation";
		if(__map_reserved["function"] != null) _g55.setReserved("function","saturn.core.domain.SgcEntryClone.loadTranslation"); else _g55.h["function"] = "saturn.core.domain.SgcEntryClone.loadTranslation";
		if(__map_reserved.icon != null) _g55.setReserved("icon","structure_16.png"); else _g55.h["icon"] = "structure_16.png";
		value54 = _g55;
		if(__map_reserved.translation != null) _g54.setReserved("translation",value54); else _g54.h["translation"] = value54;
		value53 = _g54;
		if(__map_reserved.search_bar != null) _g53.setReserved("search_bar",value53); else _g53.h["search_bar"] = value53;
		value52 = _g53;
		_g51.set("actions",value52);
		value50 = _g51;
		if(__map_reserved.options != null) _g46.setReserved("options",value50); else _g46.h["options"] = value50;
		var value55;
		var _g56 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g56.setReserved("schema","SGC"); else _g56.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g56.setReserved("name","ENTRY_CLONE"); else _g56.h["name"] = "ENTRY_CLONE";
		value55 = _g56;
		if(__map_reserved.table_info != null) _g46.setReserved("table_info",value55); else _g46.h["table_info"] = value55;
		var value56;
		var _g57 = new haxe.ds.StringMap();
		if(__map_reserved["Entry Clone ID"] != null) _g57.setReserved("Entry Clone ID","entryCloneId"); else _g57.h["Entry Clone ID"] = "entryCloneId";
		if(__map_reserved["Target ID"] != null) _g57.setReserved("Target ID","target.targetId"); else _g57.h["Target ID"] = "target.targetId";
		value56 = _g57;
		if(__map_reserved.model != null) _g46.setReserved("model",value56); else _g46.h["model"] = value56;
		var value57;
		var _g58 = new haxe.ds.StringMap();
		var value58;
		var _g59 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g59.setReserved("field","targetId"); else _g59.h["field"] = "targetId";
		if(__map_reserved["class"] != null) _g59.setReserved("class","saturn.core.domain.SgcTarget"); else _g59.h["class"] = "saturn.core.domain.SgcTarget";
		if(__map_reserved.fk_field != null) _g59.setReserved("fk_field","id"); else _g59.h["fk_field"] = "id";
		value58 = _g59;
		_g58.set("target",value58);
		value57 = _g58;
		if(__map_reserved["fields.synthetic"] != null) _g46.setReserved("fields.synthetic",value57); else _g46.h["fields.synthetic"] = value57;
		value45 = _g46;
		if(__map_reserved["saturn.core.domain.SgcEntryClone"] != null) _g.setReserved("saturn.core.domain.SgcEntryClone",value45); else _g.h["saturn.core.domain.SgcEntryClone"] = value45;
		var value59;
		var _g60 = new haxe.ds.StringMap();
		var value60;
		var _g61 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g61.setReserved("enzymeName","RESTRICTION_ENZYME_NAME"); else _g61.h["enzymeName"] = "RESTRICTION_ENZYME_NAME";
		if(__map_reserved.cutSequence != null) _g61.setReserved("cutSequence","RESTRICTION_ENZYME_SEQUENCERAW"); else _g61.h["cutSequence"] = "RESTRICTION_ENZYME_SEQUENCERAW";
		if(__map_reserved.id != null) _g61.setReserved("id","PKEY"); else _g61.h["id"] = "PKEY";
		value60 = _g61;
		if(__map_reserved.fields != null) _g60.setReserved("fields",value60); else _g60.h["fields"] = value60;
		var value61;
		var _g62 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g62.setReserved("enzymeName",false); else _g62.h["enzymeName"] = false;
		if(__map_reserved.id != null) _g62.setReserved("id",true); else _g62.h["id"] = true;
		value61 = _g62;
		if(__map_reserved.indexes != null) _g60.setReserved("indexes",value61); else _g60.h["indexes"] = value61;
		var value62;
		var _g63 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g63.setReserved("schema","SGC"); else _g63.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g63.setReserved("name","RESTRICTION_ENZYME"); else _g63.h["name"] = "RESTRICTION_ENZYME";
		value62 = _g63;
		if(__map_reserved.table_info != null) _g60.setReserved("table_info",value62); else _g60.h["table_info"] = value62;
		var value63;
		var _g64 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g64.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g64.h["saturn.client.programs.DNASequenceEditor"] = true;
		value63 = _g64;
		if(__map_reserved.programs != null) _g60.setReserved("programs",value63); else _g60.h["programs"] = value63;
		var value64;
		var _g65 = new haxe.ds.StringMap();
		if(__map_reserved["Enzyme Name"] != null) _g65.setReserved("Enzyme Name","enzymeName"); else _g65.h["Enzyme Name"] = "enzymeName";
		value64 = _g65;
		if(__map_reserved.model != null) _g60.setReserved("model",value64); else _g60.h["model"] = value64;
		var value65;
		var _g66 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g66.setReserved("alias","Restriction site"); else _g66.h["alias"] = "Restriction site";
		if(__map_reserved["file.new.label"] != null) _g66.setReserved("file.new.label","Restriction Site"); else _g66.h["file.new.label"] = "Restriction Site";
		value65 = _g66;
		if(__map_reserved.options != null) _g60.setReserved("options",value65); else _g60.h["options"] = value65;
		var value66;
		var _g67 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g67.setReserved("enzymeName",null); else _g67.h["enzymeName"] = null;
		value66 = _g67;
		if(__map_reserved.search != null) _g60.setReserved("search",value66); else _g60.h["search"] = value66;
		value59 = _g60;
		if(__map_reserved["saturn.core.domain.SgcRestrictionSite"] != null) _g.setReserved("saturn.core.domain.SgcRestrictionSite",value59); else _g.h["saturn.core.domain.SgcRestrictionSite"] = value59;
		var value67;
		var _g68 = new haxe.ds.StringMap();
		var value68;
		var _g69 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g69.setReserved("vectorId","VECTOR_NAME"); else _g69.h["vectorId"] = "VECTOR_NAME";
		if(__map_reserved.id != null) _g69.setReserved("id","PKEY"); else _g69.h["id"] = "PKEY";
		if(__map_reserved.sequence != null) _g69.setReserved("sequence","VECTORSEQUENCERAW"); else _g69.h["sequence"] = "VECTORSEQUENCERAW";
		if(__map_reserved.vectorComments != null) _g69.setReserved("vectorComments","VECTORCOMMENTS"); else _g69.h["vectorComments"] = "VECTORCOMMENTS";
		if(__map_reserved.proteaseName != null) _g69.setReserved("proteaseName","PROTEASE_NAME"); else _g69.h["proteaseName"] = "PROTEASE_NAME";
		if(__map_reserved.proteaseCutSequence != null) _g69.setReserved("proteaseCutSequence","PROTEASE_CUTSEQUENCE"); else _g69.h["proteaseCutSequence"] = "PROTEASE_CUTSEQUENCE";
		if(__map_reserved.proteaseProduct != null) _g69.setReserved("proteaseProduct","PROTEASE_PRODUCT"); else _g69.h["proteaseProduct"] = "PROTEASE_PRODUCT";
		if(__map_reserved.antibiotic != null) _g69.setReserved("antibiotic","ANTIBIOTIC"); else _g69.h["antibiotic"] = "ANTIBIOTIC";
		if(__map_reserved.organism != null) _g69.setReserved("organism","ORGANISM"); else _g69.h["organism"] = "ORGANISM";
		if(__map_reserved.res1Id != null) _g69.setReserved("res1Id","SGCRESTRICTENZ1_PKEY"); else _g69.h["res1Id"] = "SGCRESTRICTENZ1_PKEY";
		if(__map_reserved.res2Id != null) _g69.setReserved("res2Id","SGCRESTRICTENZ2_PKEY"); else _g69.h["res2Id"] = "SGCRESTRICTENZ2_PKEY";
		if(__map_reserved.addStopCodon != null) _g69.setReserved("addStopCodon","REQUIRES_STOP_CODON"); else _g69.h["addStopCodon"] = "REQUIRES_STOP_CODON";
		if(__map_reserved.requiredForwardExtension != null) _g69.setReserved("requiredForwardExtension","REQUIRED_EXTENSION_FORWARD"); else _g69.h["requiredForwardExtension"] = "REQUIRED_EXTENSION_FORWARD";
		if(__map_reserved.requiredReverseExtension != null) _g69.setReserved("requiredReverseExtension","REQUIRED_EXTENSION_REVERSE"); else _g69.h["requiredReverseExtension"] = "REQUIRED_EXTENSION_REVERSE";
		value68 = _g69;
		if(__map_reserved.fields != null) _g68.setReserved("fields",value68); else _g68.h["fields"] = value68;
		var value69;
		var _g70 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g70.setReserved("vectorId",null); else _g70.h["vectorId"] = null;
		value69 = _g70;
		if(__map_reserved.search != null) _g68.setReserved("search",value69); else _g68.h["search"] = value69;
		var value70;
		var _g71 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g71.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g71.h["saturn.client.programs.DNASequenceEditor"] = true;
		value70 = _g71;
		if(__map_reserved.programs != null) _g68.setReserved("programs",value70); else _g68.h["programs"] = value70;
		var value71;
		var _g72 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g72.setReserved("vectorId",false); else _g72.h["vectorId"] = false;
		if(__map_reserved.id != null) _g72.setReserved("id",true); else _g72.h["id"] = true;
		value71 = _g72;
		if(__map_reserved.indexes != null) _g68.setReserved("indexes",value71); else _g68.h["indexes"] = value71;
		var value72;
		var _g73 = new haxe.ds.StringMap();
		var value73;
		var _g74 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g74.setReserved("field","res1Id"); else _g74.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g74.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g74.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g74.setReserved("fk_field","id"); else _g74.h["fk_field"] = "id";
		value73 = _g74;
		_g73.set("res1",value73);
		var value74;
		var _g75 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g75.setReserved("field","res2Id"); else _g75.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g75.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g75.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g75.setReserved("fk_field","id"); else _g75.h["fk_field"] = "id";
		value74 = _g75;
		_g73.set("res2",value74);
		value72 = _g73;
		if(__map_reserved["fields.synthetic"] != null) _g68.setReserved("fields.synthetic",value72); else _g68.h["fields.synthetic"] = value72;
		var value75;
		var _g76 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g76.setReserved("schema","SGC"); else _g76.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g76.setReserved("name","VECTOR"); else _g76.h["name"] = "VECTOR";
		value75 = _g76;
		if(__map_reserved.table_info != null) _g68.setReserved("table_info",value75); else _g68.h["table_info"] = value75;
		var value76;
		var _g77 = new haxe.ds.StringMap();
		if(__map_reserved.auto_activate != null) _g77.setReserved("auto_activate","3"); else _g77.h["auto_activate"] = "3";
		if(__map_reserved.alias != null) _g77.setReserved("alias","Vector"); else _g77.h["alias"] = "Vector";
		if(__map_reserved["file.new.label"] != null) _g77.setReserved("file.new.label","Vector"); else _g77.h["file.new.label"] = "Vector";
		value76 = _g77;
		if(__map_reserved.options != null) _g68.setReserved("options",value76); else _g68.h["options"] = value76;
		var value77;
		var _g78 = new haxe.ds.StringMap();
		if(__map_reserved.Name != null) _g78.setReserved("Name","vectorId"); else _g78.h["Name"] = "vectorId";
		if(__map_reserved.Comments != null) _g78.setReserved("Comments","vectorComments"); else _g78.h["Comments"] = "vectorComments";
		if(__map_reserved.Protease != null) _g78.setReserved("Protease","proteaseName"); else _g78.h["Protease"] = "proteaseName";
		if(__map_reserved["Protease cut sequence"] != null) _g78.setReserved("Protease cut sequence","proteaseCutSequence"); else _g78.h["Protease cut sequence"] = "proteaseCutSequence";
		if(__map_reserved["Protease product"] != null) _g78.setReserved("Protease product","proteaseProduct"); else _g78.h["Protease product"] = "proteaseProduct";
		if(__map_reserved["Forward extension"] != null) _g78.setReserved("Forward extension","requiredForwardExtension"); else _g78.h["Forward extension"] = "requiredForwardExtension";
		if(__map_reserved["Reverse extension"] != null) _g78.setReserved("Reverse extension","requiredReverseExtension"); else _g78.h["Reverse extension"] = "requiredReverseExtension";
		if(__map_reserved["Restriction site 1"] != null) _g78.setReserved("Restriction site 1","res1.enzymeName"); else _g78.h["Restriction site 1"] = "res1.enzymeName";
		if(__map_reserved["Restriction site 2"] != null) _g78.setReserved("Restriction site 2","res2.enzymeName"); else _g78.h["Restriction site 2"] = "res2.enzymeName";
		value77 = _g78;
		if(__map_reserved.model != null) _g68.setReserved("model",value77); else _g68.h["model"] = value77;
		value67 = _g68;
		if(__map_reserved["saturn.core.domain.SgcVector"] != null) _g.setReserved("saturn.core.domain.SgcVector",value67); else _g.h["saturn.core.domain.SgcVector"] = value67;
		var value78;
		var _g79 = new haxe.ds.StringMap();
		var value79;
		var _g80 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g80.setReserved("primerId","PRIMERNAME"); else _g80.h["primerId"] = "PRIMERNAME";
		if(__map_reserved.id != null) _g80.setReserved("id","PKEY"); else _g80.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g80.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g80.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		value79 = _g80;
		if(__map_reserved.fields != null) _g79.setReserved("fields",value79); else _g79.h["fields"] = value79;
		var value80;
		var _g81 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g81.setReserved("primerId",false); else _g81.h["primerId"] = false;
		if(__map_reserved.id != null) _g81.setReserved("id",true); else _g81.h["id"] = true;
		value80 = _g81;
		if(__map_reserved.indexes != null) _g79.setReserved("indexes",value80); else _g79.h["indexes"] = value80;
		var value81;
		var _g82 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g82.setReserved("schema","SGC"); else _g82.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g82.setReserved("name","PRIMER"); else _g82.h["name"] = "PRIMER";
		value81 = _g82;
		if(__map_reserved.table_info != null) _g79.setReserved("table_info",value81); else _g79.h["table_info"] = value81;
		var value82;
		var _g83 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g83.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g83.h["saturn.client.programs.DNASequenceEditor"] = true;
		value82 = _g83;
		if(__map_reserved.programs != null) _g79.setReserved("programs",value82); else _g79.h["programs"] = value82;
		var value83;
		var _g84 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g84.setReserved("primerId",true); else _g84.h["primerId"] = true;
		value83 = _g84;
		if(__map_reserved.search != null) _g79.setReserved("search",value83); else _g79.h["search"] = value83;
		var value84;
		var _g85 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g85.setReserved("alias","Forward Primer"); else _g85.h["alias"] = "Forward Primer";
		if(__map_reserved["file.new.label"] != null) _g85.setReserved("file.new.label","Forward Primer"); else _g85.h["file.new.label"] = "Forward Primer";
		if(__map_reserved.icon != null) _g85.setReserved("icon","dna_conical_16.png"); else _g85.h["icon"] = "dna_conical_16.png";
		value84 = _g85;
		if(__map_reserved.options != null) _g79.setReserved("options",value84); else _g79.h["options"] = value84;
		var value85;
		var _g86 = new haxe.ds.StringMap();
		if(__map_reserved["Primer ID"] != null) _g86.setReserved("Primer ID","primerId"); else _g86.h["Primer ID"] = "primerId";
		value85 = _g86;
		if(__map_reserved.model != null) _g79.setReserved("model",value85); else _g79.h["model"] = value85;
		value78 = _g79;
		if(__map_reserved["saturn.core.domain.SgcForwardPrimer"] != null) _g.setReserved("saturn.core.domain.SgcForwardPrimer",value78); else _g.h["saturn.core.domain.SgcForwardPrimer"] = value78;
		var value86;
		var _g87 = new haxe.ds.StringMap();
		var value87;
		var _g88 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g88.setReserved("primerId","PRIMERNAME"); else _g88.h["primerId"] = "PRIMERNAME";
		if(__map_reserved.id != null) _g88.setReserved("id","PKEY"); else _g88.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g88.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g88.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		value87 = _g88;
		if(__map_reserved.fields != null) _g87.setReserved("fields",value87); else _g87.h["fields"] = value87;
		var value88;
		var _g89 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g89.setReserved("primerId",false); else _g89.h["primerId"] = false;
		if(__map_reserved.id != null) _g89.setReserved("id",true); else _g89.h["id"] = true;
		value88 = _g89;
		if(__map_reserved.indexes != null) _g87.setReserved("indexes",value88); else _g87.h["indexes"] = value88;
		var value89;
		var _g90 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g90.setReserved("schema","SGC"); else _g90.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g90.setReserved("name","PRIMERREV"); else _g90.h["name"] = "PRIMERREV";
		value89 = _g90;
		if(__map_reserved.table_info != null) _g87.setReserved("table_info",value89); else _g87.h["table_info"] = value89;
		var value90;
		var _g91 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g91.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g91.h["saturn.client.programs.DNASequenceEditor"] = true;
		value90 = _g91;
		if(__map_reserved.programs != null) _g87.setReserved("programs",value90); else _g87.h["programs"] = value90;
		var value91;
		var _g92 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g92.setReserved("primerId",true); else _g92.h["primerId"] = true;
		value91 = _g92;
		if(__map_reserved.search != null) _g87.setReserved("search",value91); else _g87.h["search"] = value91;
		var value92;
		var _g93 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g93.setReserved("alias","Reverse Primer"); else _g93.h["alias"] = "Reverse Primer";
		if(__map_reserved["file.new.label"] != null) _g93.setReserved("file.new.label","Reverse Primer"); else _g93.h["file.new.label"] = "Reverse Primer";
		if(__map_reserved.icon != null) _g93.setReserved("icon","dna_conical_16.png"); else _g93.h["icon"] = "dna_conical_16.png";
		value92 = _g93;
		if(__map_reserved.options != null) _g87.setReserved("options",value92); else _g87.h["options"] = value92;
		var value93;
		var _g94 = new haxe.ds.StringMap();
		if(__map_reserved["Primer ID"] != null) _g94.setReserved("Primer ID","primerId"); else _g94.h["Primer ID"] = "primerId";
		value93 = _g94;
		if(__map_reserved.model != null) _g87.setReserved("model",value93); else _g87.h["model"] = value93;
		value86 = _g87;
		if(__map_reserved["saturn.core.domain.SgcReversePrimer"] != null) _g.setReserved("saturn.core.domain.SgcReversePrimer",value86); else _g.h["saturn.core.domain.SgcReversePrimer"] = value86;
		var value94;
		var _g95 = new haxe.ds.StringMap();
		var value95;
		var _g96 = new haxe.ds.StringMap();
		if(__map_reserved.purificationId != null) _g96.setReserved("purificationId","PURIFICATIONID"); else _g96.h["purificationId"] = "PURIFICATIONID";
		if(__map_reserved.id != null) _g96.setReserved("id","PKEY"); else _g96.h["id"] = "PKEY";
		if(__map_reserved.expressionId != null) _g96.setReserved("expressionId","EXPRESSION_PKEY"); else _g96.h["expressionId"] = "EXPRESSION_PKEY";
		if(__map_reserved.column != null) _g96.setReserved("column","COLUMN1"); else _g96.h["column"] = "COLUMN1";
		if(__map_reserved.elnId != null) _g96.setReserved("elnId","ELNEXP"); else _g96.h["elnId"] = "ELNEXP";
		if(__map_reserved.comments != null) _g96.setReserved("comments","COMMENTS"); else _g96.h["comments"] = "COMMENTS";
		value95 = _g96;
		if(__map_reserved.fields != null) _g95.setReserved("fields",value95); else _g95.h["fields"] = value95;
		var value96;
		var _g97 = new haxe.ds.StringMap();
		if(__map_reserved.purificationId != null) _g97.setReserved("purificationId",false); else _g97.h["purificationId"] = false;
		if(__map_reserved.id != null) _g97.setReserved("id",true); else _g97.h["id"] = true;
		value96 = _g97;
		if(__map_reserved.indexes != null) _g95.setReserved("indexes",value96); else _g95.h["indexes"] = value96;
		var value97;
		var _g98 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g98.setReserved("schema","SGC"); else _g98.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g98.setReserved("name","PURIFICATION"); else _g98.h["name"] = "PURIFICATION";
		value97 = _g98;
		if(__map_reserved.table_info != null) _g95.setReserved("table_info",value97); else _g95.h["table_info"] = value97;
		var value98;
		var _g99 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.EmptyViewer"] != null) _g99.setReserved("saturn.client.programs.EmptyViewer",true); else _g99.h["saturn.client.programs.EmptyViewer"] = true;
		value98 = _g99;
		if(__map_reserved.programs != null) _g95.setReserved("programs",value98); else _g95.h["programs"] = value98;
		var value99;
		var _g100 = new haxe.ds.StringMap();
		var value100;
		var _g101 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g101.setReserved("field","expressionId"); else _g101.h["field"] = "expressionId";
		if(__map_reserved["class"] != null) _g101.setReserved("class","saturn.core.domain.SgcExpression"); else _g101.h["class"] = "saturn.core.domain.SgcExpression";
		if(__map_reserved.fk_field != null) _g101.setReserved("fk_field","id"); else _g101.h["fk_field"] = "id";
		value100 = _g101;
		_g100.set("expression",value100);
		value99 = _g100;
		if(__map_reserved["fields.synthetic"] != null) _g95.setReserved("fields.synthetic",value99); else _g95.h["fields.synthetic"] = value99;
		var value101;
		var _g102 = new haxe.ds.StringMap();
		if(__map_reserved["Purification ID"] != null) _g102.setReserved("Purification ID","purificationId"); else _g102.h["Purification ID"] = "purificationId";
		if(__map_reserved["Expression ID"] != null) _g102.setReserved("Expression ID","expressionId"); else _g102.h["Expression ID"] = "expressionId";
		if(__map_reserved["ELN ID"] != null) _g102.setReserved("ELN ID","elnId"); else _g102.h["ELN ID"] = "elnId";
		if(__map_reserved.Comments != null) _g102.setReserved("Comments","comments"); else _g102.h["Comments"] = "comments";
		value101 = _g102;
		if(__map_reserved.model != null) _g95.setReserved("model",value101); else _g95.h["model"] = value101;
		var value102;
		var _g103 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g103.setReserved("alias","Purifications"); else _g103.h["alias"] = "Purifications";
		if(__map_reserved["file.new.label"] != null) _g103.setReserved("file.new.label","Purification"); else _g103.h["file.new.label"] = "Purification";
		if(__map_reserved.icon != null) _g103.setReserved("icon","dna_conical_16.png"); else _g103.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g103.setReserved("auto_activate","3"); else _g103.h["auto_activate"] = "3";
		value102 = _g103;
		if(__map_reserved.options != null) _g95.setReserved("options",value102); else _g95.h["options"] = value102;
		value94 = _g95;
		if(__map_reserved["saturn.core.domain.SgcPurification"] != null) _g.setReserved("saturn.core.domain.SgcPurification",value94); else _g.h["saturn.core.domain.SgcPurification"] = value94;
		var value103;
		var _g104 = new haxe.ds.StringMap();
		var value104;
		var _g105 = new haxe.ds.StringMap();
		if(__map_reserved.cloneId != null) _g105.setReserved("cloneId","CLONE_ID"); else _g105.h["cloneId"] = "CLONE_ID";
		if(__map_reserved.id != null) _g105.setReserved("id","PKEY"); else _g105.h["id"] = "PKEY";
		if(__map_reserved.constructId != null) _g105.setReserved("constructId","SGCCONSTRUCT1_PKEY"); else _g105.h["constructId"] = "SGCCONSTRUCT1_PKEY";
		if(__map_reserved.elnId != null) _g105.setReserved("elnId","ELNEXP"); else _g105.h["elnId"] = "ELNEXP";
		if(__map_reserved.comments != null) _g105.setReserved("comments","COMMENTS"); else _g105.h["comments"] = "COMMENTS";
		value104 = _g105;
		if(__map_reserved.fields != null) _g104.setReserved("fields",value104); else _g104.h["fields"] = value104;
		var value105;
		var _g106 = new haxe.ds.StringMap();
		if(__map_reserved.cloneId != null) _g106.setReserved("cloneId",false); else _g106.h["cloneId"] = false;
		if(__map_reserved.id != null) _g106.setReserved("id",true); else _g106.h["id"] = true;
		value105 = _g106;
		if(__map_reserved.indexes != null) _g104.setReserved("indexes",value105); else _g104.h["indexes"] = value105;
		var value106;
		var _g107 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g107.setReserved("alias","Clones"); else _g107.h["alias"] = "Clones";
		if(__map_reserved["file.new.label"] != null) _g107.setReserved("file.new.label","Clone"); else _g107.h["file.new.label"] = "Clone";
		if(__map_reserved.icon != null) _g107.setReserved("icon","dna_conical_16.png"); else _g107.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g107.setReserved("auto_activate","3"); else _g107.h["auto_activate"] = "3";
		value106 = _g107;
		if(__map_reserved.options != null) _g104.setReserved("options",value106); else _g104.h["options"] = value106;
		var value107;
		var _g108 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g108.setReserved("schema","SGC"); else _g108.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g108.setReserved("name","CLONE"); else _g108.h["name"] = "CLONE";
		value107 = _g108;
		if(__map_reserved.table_info != null) _g104.setReserved("table_info",value107); else _g104.h["table_info"] = value107;
		var value108;
		var _g109 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.EmptyViewer"] != null) _g109.setReserved("saturn.client.programs.EmptyViewer",true); else _g109.h["saturn.client.programs.EmptyViewer"] = true;
		value108 = _g109;
		if(__map_reserved.programs != null) _g104.setReserved("programs",value108); else _g104.h["programs"] = value108;
		var value109;
		var _g110 = new haxe.ds.StringMap();
		var value110;
		var _g111 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g111.setReserved("field","constructId"); else _g111.h["field"] = "constructId";
		if(__map_reserved["class"] != null) _g111.setReserved("class","saturn.core.domain.SgcConstruct"); else _g111.h["class"] = "saturn.core.domain.SgcConstruct";
		if(__map_reserved.fk_field != null) _g111.setReserved("fk_field","id"); else _g111.h["fk_field"] = "id";
		value110 = _g111;
		_g110.set("construct",value110);
		value109 = _g110;
		if(__map_reserved["fields.synthetic"] != null) _g104.setReserved("fields.synthetic",value109); else _g104.h["fields.synthetic"] = value109;
		var value111;
		var _g112 = new haxe.ds.StringMap();
		if(__map_reserved["Clone ID"] != null) _g112.setReserved("Clone ID","cloneId"); else _g112.h["Clone ID"] = "cloneId";
		if(__map_reserved["Construct ID"] != null) _g112.setReserved("Construct ID","construct.constructId"); else _g112.h["Construct ID"] = "construct.constructId";
		if(__map_reserved["ELN ID"] != null) _g112.setReserved("ELN ID","elnId"); else _g112.h["ELN ID"] = "elnId";
		if(__map_reserved.Comments != null) _g112.setReserved("Comments","comments"); else _g112.h["Comments"] = "comments";
		value111 = _g112;
		if(__map_reserved.model != null) _g104.setReserved("model",value111); else _g104.h["model"] = value111;
		value103 = _g104;
		if(__map_reserved["saturn.core.domain.SgcClone"] != null) _g.setReserved("saturn.core.domain.SgcClone",value103); else _g.h["saturn.core.domain.SgcClone"] = value103;
		var value112;
		var _g113 = new haxe.ds.StringMap();
		var value113;
		var _g114 = new haxe.ds.StringMap();
		if(__map_reserved.expressionId != null) _g114.setReserved("expressionId","EXPRESSION_ID"); else _g114.h["expressionId"] = "EXPRESSION_ID";
		if(__map_reserved.id != null) _g114.setReserved("id","PKEY"); else _g114.h["id"] = "PKEY";
		if(__map_reserved.cloneId != null) _g114.setReserved("cloneId","SGCCLONE_PKEY"); else _g114.h["cloneId"] = "SGCCLONE_PKEY";
		if(__map_reserved.elnId != null) _g114.setReserved("elnId","ELNEXP"); else _g114.h["elnId"] = "ELNEXP";
		if(__map_reserved.comments != null) _g114.setReserved("comments","COMMENTS"); else _g114.h["comments"] = "COMMENTS";
		value113 = _g114;
		if(__map_reserved.fields != null) _g113.setReserved("fields",value113); else _g113.h["fields"] = value113;
		var value114;
		var _g115 = new haxe.ds.StringMap();
		if(__map_reserved.expressionId != null) _g115.setReserved("expressionId",false); else _g115.h["expressionId"] = false;
		if(__map_reserved.id != null) _g115.setReserved("id",true); else _g115.h["id"] = true;
		value114 = _g115;
		if(__map_reserved.indexes != null) _g113.setReserved("indexes",value114); else _g113.h["indexes"] = value114;
		var value115;
		var _g116 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g116.setReserved("schema","SGC"); else _g116.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g116.setReserved("name","EXPRESSION"); else _g116.h["name"] = "EXPRESSION";
		value115 = _g116;
		if(__map_reserved.table_info != null) _g113.setReserved("table_info",value115); else _g113.h["table_info"] = value115;
		var value116;
		var _g117 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.EmptyViewer"] != null) _g117.setReserved("saturn.client.programs.EmptyViewer",true); else _g117.h["saturn.client.programs.EmptyViewer"] = true;
		value116 = _g117;
		if(__map_reserved.programs != null) _g113.setReserved("programs",value116); else _g113.h["programs"] = value116;
		var value117;
		var _g118 = new haxe.ds.StringMap();
		var value118;
		var _g119 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g119.setReserved("field","cloneId"); else _g119.h["field"] = "cloneId";
		if(__map_reserved["class"] != null) _g119.setReserved("class","saturn.core.domain.SgcClone"); else _g119.h["class"] = "saturn.core.domain.SgcClone";
		if(__map_reserved.fk_field != null) _g119.setReserved("fk_field","id"); else _g119.h["fk_field"] = "id";
		value118 = _g119;
		_g118.set("clone",value118);
		value117 = _g118;
		if(__map_reserved["fields.synthetic"] != null) _g113.setReserved("fields.synthetic",value117); else _g113.h["fields.synthetic"] = value117;
		var value119;
		var _g120 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g120.setReserved("alias","Expressions"); else _g120.h["alias"] = "Expressions";
		if(__map_reserved["file.new.label"] != null) _g120.setReserved("file.new.label","Expression"); else _g120.h["file.new.label"] = "Expression";
		if(__map_reserved.icon != null) _g120.setReserved("icon","dna_conical_16.png"); else _g120.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g120.setReserved("auto_activate","3"); else _g120.h["auto_activate"] = "3";
		value119 = _g120;
		if(__map_reserved.options != null) _g113.setReserved("options",value119); else _g113.h["options"] = value119;
		var value120;
		var _g121 = new haxe.ds.StringMap();
		if(__map_reserved["Expression ID"] != null) _g121.setReserved("Expression ID","expressionId"); else _g121.h["Expression ID"] = "expressionId";
		if(__map_reserved["Clone ID"] != null) _g121.setReserved("Clone ID","clone.cloneId"); else _g121.h["Clone ID"] = "clone.cloneId";
		if(__map_reserved["ELN ID"] != null) _g121.setReserved("ELN ID","elnId"); else _g121.h["ELN ID"] = "elnId";
		if(__map_reserved.Comments != null) _g121.setReserved("Comments","comments"); else _g121.h["Comments"] = "comments";
		value120 = _g121;
		if(__map_reserved.model != null) _g113.setReserved("model",value120); else _g113.h["model"] = value120;
		value112 = _g113;
		if(__map_reserved["saturn.core.domain.SgcExpression"] != null) _g.setReserved("saturn.core.domain.SgcExpression",value112); else _g.h["saturn.core.domain.SgcExpression"] = value112;
		var value121;
		var _g122 = new haxe.ds.StringMap();
		var value122;
		var _g123 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g123.setReserved("targetId","TARGET_ID"); else _g123.h["targetId"] = "TARGET_ID";
		if(__map_reserved.id != null) _g123.setReserved("id","PKEY"); else _g123.h["id"] = "PKEY";
		if(__map_reserved.gi != null) _g123.setReserved("gi","GENBANK_ID"); else _g123.h["gi"] = "GENBANK_ID";
		if(__map_reserved.geneId != null) _g123.setReserved("geneId","NCBIGENEID"); else _g123.h["geneId"] = "NCBIGENEID";
		if(__map_reserved.proteinSeq != null) _g123.setReserved("proteinSeq","PROTEINSEQUENCE"); else _g123.h["proteinSeq"] = "PROTEINSEQUENCE";
		if(__map_reserved.dnaSeq != null) _g123.setReserved("dnaSeq","NUCLEOTIDESEQUENCE"); else _g123.h["dnaSeq"] = "NUCLEOTIDESEQUENCE";
		if(__map_reserved.activeStatus != null) _g123.setReserved("activeStatus","ACTIVESTATUS"); else _g123.h["activeStatus"] = "ACTIVESTATUS";
		if(__map_reserved.pi != null) _g123.setReserved("pi","PI"); else _g123.h["pi"] = "PI";
		if(__map_reserved.comments != null) _g123.setReserved("comments","COMMENTS"); else _g123.h["comments"] = "COMMENTS";
		value122 = _g123;
		if(__map_reserved.fields != null) _g122.setReserved("fields",value122); else _g122.h["fields"] = value122;
		var value123;
		var _g124 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g124.setReserved("targetId",false); else _g124.h["targetId"] = false;
		if(__map_reserved.id != null) _g124.setReserved("id",true); else _g124.h["id"] = true;
		value123 = _g124;
		if(__map_reserved.indexes != null) _g122.setReserved("indexes",value123); else _g122.h["indexes"] = value123;
		var value124;
		var _g125 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g125.setReserved("schema","SGC"); else _g125.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g125.setReserved("name","TARGET"); else _g125.h["name"] = "TARGET";
		if(__map_reserved.human_name != null) _g125.setReserved("human_name","Target"); else _g125.h["human_name"] = "Target";
		if(__map_reserved.human_name_plural != null) _g125.setReserved("human_name_plural","Targets"); else _g125.h["human_name_plural"] = "Targets";
		value124 = _g125;
		if(__map_reserved.table_info != null) _g122.setReserved("table_info",value124); else _g122.h["table_info"] = value124;
		var value125;
		var _g126 = new haxe.ds.StringMap();
		if(__map_reserved["Target ID"] != null) _g126.setReserved("Target ID","targetId"); else _g126.h["Target ID"] = "targetId";
		if(__map_reserved["Genbank ID"] != null) _g126.setReserved("Genbank ID","gi"); else _g126.h["Genbank ID"] = "gi";
		if(__map_reserved["DNA Sequence"] != null) _g126.setReserved("DNA Sequence","dnaSeq"); else _g126.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved["Protein Sequence"] != null) _g126.setReserved("Protein Sequence","proteinSeq"); else _g126.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g126.setReserved("__HIDDEN__PKEY__","id"); else _g126.h["__HIDDEN__PKEY__"] = "id";
		value125 = _g126;
		if(__map_reserved.model != null) _g122.setReserved("model",value125); else _g122.h["model"] = value125;
		var value126;
		var _g127 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g127.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g127.h["saturn.client.programs.DNASequenceEditor"] = true;
		value126 = _g127;
		if(__map_reserved.programs != null) _g122.setReserved("programs",value126); else _g122.h["programs"] = value126;
		var value127;
		var _g128 = new haxe.ds.StringMap();
		var value128;
		var _g129 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g129.setReserved("field","proteinSeq"); else _g129.h["field"] = "proteinSeq";
		if(__map_reserved["class"] != null) _g129.setReserved("class","saturn.core.Protein"); else _g129.h["class"] = "saturn.core.Protein";
		if(__map_reserved.fk_field != null) _g129.setReserved("fk_field",null); else _g129.h["fk_field"] = null;
		value128 = _g129;
		_g128.set("proteinSequenceObj",value128);
		value127 = _g128;
		if(__map_reserved["fields.synthetic"] != null) _g122.setReserved("fields.synthetic",value127); else _g122.h["fields.synthetic"] = value127;
		var value129;
		var _g130 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g130.setReserved("id_pattern",".*"); else _g130.h["id_pattern"] = ".*";
		if(__map_reserved.alias != null) _g130.setReserved("alias","Targets"); else _g130.h["alias"] = "Targets";
		if(__map_reserved["file.new.label"] != null) _g130.setReserved("file.new.label","Target"); else _g130.h["file.new.label"] = "Target";
		if(__map_reserved.icon != null) _g130.setReserved("icon","protein_16.png"); else _g130.h["icon"] = "protein_16.png";
		_g130.set("actions",[]);
		if(__map_reserved.auto_activate != null) _g130.setReserved("auto_activate","3"); else _g130.h["auto_activate"] = "3";
		value129 = _g130;
		if(__map_reserved.options != null) _g122.setReserved("options",value129); else _g122.h["options"] = value129;
		value121 = _g122;
		if(__map_reserved["saturn.core.domain.SgcTarget"] != null) _g.setReserved("saturn.core.domain.SgcTarget",value121); else _g.h["saturn.core.domain.SgcTarget"] = value121;
		var value130;
		var _g131 = new haxe.ds.StringMap();
		var value131;
		var _g132 = new haxe.ds.StringMap();
		if(__map_reserved.sequence != null) _g132.setReserved("sequence","SEQ"); else _g132.h["sequence"] = "SEQ";
		if(__map_reserved.id != null) _g132.setReserved("id","PKEY"); else _g132.h["id"] = "PKEY";
		if(__map_reserved.type != null) _g132.setReserved("type","SEQTYPE"); else _g132.h["type"] = "SEQTYPE";
		if(__map_reserved.version != null) _g132.setReserved("version","TARGETVERSION"); else _g132.h["version"] = "TARGETVERSION";
		if(__map_reserved.targetId != null) _g132.setReserved("targetId","SGCTARGET_PKEY"); else _g132.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.crc != null) _g132.setReserved("crc","CRC"); else _g132.h["crc"] = "CRC";
		if(__map_reserved.target != null) _g132.setReserved("target","TARGET_ID"); else _g132.h["target"] = "TARGET_ID";
		value131 = _g132;
		if(__map_reserved.fields != null) _g131.setReserved("fields",value131); else _g131.h["fields"] = value131;
		var value132;
		var _g133 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g133.setReserved("id",true); else _g133.h["id"] = true;
		value132 = _g133;
		if(__map_reserved.indexes != null) _g131.setReserved("indexes",value132); else _g131.h["indexes"] = value132;
		var value133;
		var _g134 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g134.setReserved("schema",""); else _g134.h["schema"] = "";
		if(__map_reserved.name != null) _g134.setReserved("name","SEQDATA"); else _g134.h["name"] = "SEQDATA";
		value133 = _g134;
		if(__map_reserved.table_info != null) _g131.setReserved("table_info",value133); else _g131.h["table_info"] = value133;
		var value134;
		var _g135 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g135.setReserved("field","type"); else _g135.h["field"] = "type";
		if(__map_reserved.value != null) _g135.setReserved("value","Nucleotide"); else _g135.h["value"] = "Nucleotide";
		value134 = _g135;
		if(__map_reserved.selector != null) _g131.setReserved("selector",value134); else _g131.h["selector"] = value134;
		value130 = _g131;
		if(__map_reserved["saturn.core.domain.SgcTargetDNA"] != null) _g.setReserved("saturn.core.domain.SgcTargetDNA",value130); else _g.h["saturn.core.domain.SgcTargetDNA"] = value130;
		var value135;
		var _g136 = new haxe.ds.StringMap();
		var value136;
		var _g137 = new haxe.ds.StringMap();
		if(__map_reserved.sequence != null) _g137.setReserved("sequence","SEQ"); else _g137.h["sequence"] = "SEQ";
		if(__map_reserved.id != null) _g137.setReserved("id","PKEY"); else _g137.h["id"] = "PKEY";
		if(__map_reserved.type != null) _g137.setReserved("type","SEQTYPE"); else _g137.h["type"] = "SEQTYPE";
		if(__map_reserved.version != null) _g137.setReserved("version","TARGETVERSION"); else _g137.h["version"] = "TARGETVERSION";
		if(__map_reserved.targetId != null) _g137.setReserved("targetId","SGCTARGET_PKEY"); else _g137.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.crc != null) _g137.setReserved("crc","CRC"); else _g137.h["crc"] = "CRC";
		if(__map_reserved.target != null) _g137.setReserved("target","TARGET_ID"); else _g137.h["target"] = "TARGET_ID";
		value136 = _g137;
		if(__map_reserved.fields != null) _g136.setReserved("fields",value136); else _g136.h["fields"] = value136;
		var value137;
		var _g138 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g138.setReserved("id",true); else _g138.h["id"] = true;
		value137 = _g138;
		if(__map_reserved.indexes != null) _g136.setReserved("indexes",value137); else _g136.h["indexes"] = value137;
		var value138;
		var _g139 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g139.setReserved("schema",""); else _g139.h["schema"] = "";
		if(__map_reserved.name != null) _g139.setReserved("name","SEQDATA"); else _g139.h["name"] = "SEQDATA";
		value138 = _g139;
		if(__map_reserved.table_info != null) _g136.setReserved("table_info",value138); else _g136.h["table_info"] = value138;
		value135 = _g136;
		if(__map_reserved["saturn.core.domain.SgcSeqData"] != null) _g.setReserved("saturn.core.domain.SgcSeqData",value135); else _g.h["saturn.core.domain.SgcSeqData"] = value135;
		var value139;
		var _g140 = new haxe.ds.StringMap();
		var value140;
		var _g141 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g141.setReserved("id","PKEY"); else _g141.h["id"] = "PKEY";
		if(__map_reserved.accession != null) _g141.setReserved("accession","IDENTIFIER"); else _g141.h["accession"] = "IDENTIFIER";
		if(__map_reserved.start != null) _g141.setReserved("start","SEQSTART"); else _g141.h["start"] = "SEQSTART";
		if(__map_reserved.stop != null) _g141.setReserved("stop","SEQSTOP"); else _g141.h["stop"] = "SEQSTOP";
		if(__map_reserved.targetId != null) _g141.setReserved("targetId","SGCTARGET_PKEY"); else _g141.h["targetId"] = "SGCTARGET_PKEY";
		value140 = _g141;
		if(__map_reserved.fields != null) _g140.setReserved("fields",value140); else _g140.h["fields"] = value140;
		var value141;
		var _g142 = new haxe.ds.StringMap();
		if(__map_reserved.accession != null) _g142.setReserved("accession",false); else _g142.h["accession"] = false;
		if(__map_reserved.id != null) _g142.setReserved("id",true); else _g142.h["id"] = true;
		value141 = _g142;
		if(__map_reserved.indexes != null) _g140.setReserved("indexes",value141); else _g140.h["indexes"] = value141;
		value139 = _g140;
		if(__map_reserved["saturn.core.domain.SgcDomain"] != null) _g.setReserved("saturn.core.domain.SgcDomain",value139); else _g.h["saturn.core.domain.SgcDomain"] = value139;
		var value142;
		var _g143 = new haxe.ds.StringMap();
		var value143;
		var _g144 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g144.setReserved("id","PKEY"); else _g144.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g144.setReserved("plateName","PLATENAME"); else _g144.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g144.setReserved("elnRef","ELNREF"); else _g144.h["elnRef"] = "ELNREF";
		value143 = _g144;
		if(__map_reserved.fields != null) _g143.setReserved("fields",value143); else _g143.h["fields"] = value143;
		var value144;
		var _g145 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g145.setReserved("plateName",false); else _g145.h["plateName"] = false;
		if(__map_reserved.id != null) _g145.setReserved("id",true); else _g145.h["id"] = true;
		value144 = _g145;
		if(__map_reserved.indexes != null) _g143.setReserved("indexes",value144); else _g143.h["indexes"] = value144;
		var value145;
		var _g146 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g146.setReserved("schema","SGC"); else _g146.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g146.setReserved("name","CONSTRUCTPLATE"); else _g146.h["name"] = "CONSTRUCTPLATE";
		value145 = _g146;
		if(__map_reserved.table_info != null) _g143.setReserved("table_info",value145); else _g143.h["table_info"] = value145;
		var value146;
		var _g147 = new haxe.ds.StringMap();
		if(__map_reserved.icon != null) _g147.setReserved("icon","dna_conical_16.png"); else _g147.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.alias != null) _g147.setReserved("alias","Construct Plate"); else _g147.h["alias"] = "Construct Plate";
		if(__map_reserved["file.new.label"] != null) _g147.setReserved("file.new.label","Construct Plate"); else _g147.h["file.new.label"] = "Construct Plate";
		if(__map_reserved.id_pattern != null) _g147.setReserved("id_pattern","cp-"); else _g147.h["id_pattern"] = "cp-";
		if(__map_reserved.strip_id_prefix != null) _g147.setReserved("strip_id_prefix",true); else _g147.h["strip_id_prefix"] = true;
		var value147;
		var _g148 = new haxe.ds.StringMap();
		var value148;
		var _g149 = new haxe.ds.StringMap();
		var value149;
		var _g150 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g150.setReserved("user_suffix","A"); else _g150.h["user_suffix"] = "A";
		if(__map_reserved["function"] != null) _g150.setReserved("function","saturn.core.domain.SgcConstructPlate.loadPlate"); else _g150.h["function"] = "saturn.core.domain.SgcConstructPlate.loadPlate";
		value149 = _g150;
		if(__map_reserved.DEFAULT != null) _g149.setReserved("DEFAULT",value149); else _g149.h["DEFAULT"] = value149;
		value148 = _g149;
		if(__map_reserved.search_bar != null) _g148.setReserved("search_bar",value148); else _g148.h["search_bar"] = value148;
		value147 = _g148;
		_g147.set("actions",value147);
		value146 = _g147;
		if(__map_reserved.options != null) _g143.setReserved("options",value146); else _g143.h["options"] = value146;
		var value150;
		var _g151 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.EmptyViewer"] != null) _g151.setReserved("saturn.client.programs.EmptyViewer",true); else _g151.h["saturn.client.programs.EmptyViewer"] = true;
		value150 = _g151;
		if(__map_reserved.programs != null) _g143.setReserved("programs",value150); else _g143.h["programs"] = value150;
		var value151;
		var _g152 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g152.setReserved("plateName",true); else _g152.h["plateName"] = true;
		value151 = _g152;
		if(__map_reserved.search != null) _g143.setReserved("search",value151); else _g143.h["search"] = value151;
		var value152;
		var _g153 = new haxe.ds.StringMap();
		if(__map_reserved["Plate Name"] != null) _g153.setReserved("Plate Name","plateName"); else _g153.h["Plate Name"] = "plateName";
		value152 = _g153;
		if(__map_reserved.model != null) _g143.setReserved("model",value152); else _g143.h["model"] = value152;
		value142 = _g143;
		if(__map_reserved["saturn.core.domain.SgcConstructPlate"] != null) _g.setReserved("saturn.core.domain.SgcConstructPlate",value142); else _g.h["saturn.core.domain.SgcConstructPlate"] = value142;
		var value153;
		var _g154 = new haxe.ds.StringMap();
		var value154;
		var _g155 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g155.setReserved("id","PKEY"); else _g155.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g155.setReserved("plateName","PLATENAME"); else _g155.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g155.setReserved("elnRef","ELNREF"); else _g155.h["elnRef"] = "ELNREF";
		value154 = _g155;
		if(__map_reserved.fields != null) _g154.setReserved("fields",value154); else _g154.h["fields"] = value154;
		var value155;
		var _g156 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g156.setReserved("plateName",false); else _g156.h["plateName"] = false;
		if(__map_reserved.id != null) _g156.setReserved("id",true); else _g156.h["id"] = true;
		value155 = _g156;
		if(__map_reserved.indexes != null) _g154.setReserved("indexes",value155); else _g154.h["indexes"] = value155;
		var value156;
		var _g157 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g157.setReserved("schema","SGC"); else _g157.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g157.setReserved("name","PLATE"); else _g157.h["name"] = "PLATE";
		value156 = _g157;
		if(__map_reserved.table_info != null) _g154.setReserved("table_info",value156); else _g154.h["table_info"] = value156;
		var value157;
		var _g158 = new haxe.ds.StringMap();
		if(__map_reserved.icon != null) _g158.setReserved("icon","dna_conical_16.png"); else _g158.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.alias != null) _g158.setReserved("alias","Allele Plate"); else _g158.h["alias"] = "Allele Plate";
		if(__map_reserved["file.new.label"] != null) _g158.setReserved("file.new.label","Allele Plate"); else _g158.h["file.new.label"] = "Allele Plate";
		if(__map_reserved.id_pattern != null) _g158.setReserved("id_pattern","ap-"); else _g158.h["id_pattern"] = "ap-";
		if(__map_reserved.strip_id_prefix != null) _g158.setReserved("strip_id_prefix",true); else _g158.h["strip_id_prefix"] = true;
		var value158;
		var _g159 = new haxe.ds.StringMap();
		var value159;
		var _g160 = new haxe.ds.StringMap();
		var value160;
		var _g161 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g161.setReserved("user_suffix","A"); else _g161.h["user_suffix"] = "A";
		if(__map_reserved["function"] != null) _g161.setReserved("function","saturn.core.domain.SgcAllelePlate.loadPlate"); else _g161.h["function"] = "saturn.core.domain.SgcAllelePlate.loadPlate";
		value160 = _g161;
		if(__map_reserved.DEFAULT != null) _g160.setReserved("DEFAULT",value160); else _g160.h["DEFAULT"] = value160;
		value159 = _g160;
		if(__map_reserved.search_bar != null) _g159.setReserved("search_bar",value159); else _g159.h["search_bar"] = value159;
		value158 = _g159;
		_g158.set("actions",value158);
		if(__map_reserved.auto_activate != null) _g158.setReserved("auto_activate","3"); else _g158.h["auto_activate"] = "3";
		value157 = _g158;
		if(__map_reserved.options != null) _g154.setReserved("options",value157); else _g154.h["options"] = value157;
		var value161;
		var _g162 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g162.setReserved("plateName",true); else _g162.h["plateName"] = true;
		value161 = _g162;
		if(__map_reserved.search != null) _g154.setReserved("search",value161); else _g154.h["search"] = value161;
		var value162;
		var _g163 = new haxe.ds.StringMap();
		if(__map_reserved["Plate Name"] != null) _g163.setReserved("Plate Name","plateName"); else _g163.h["Plate Name"] = "plateName";
		value162 = _g163;
		if(__map_reserved.model != null) _g154.setReserved("model",value162); else _g154.h["model"] = value162;
		var value163;
		var _g164 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.EmptyViewer"] != null) _g164.setReserved("saturn.client.programs.EmptyViewer",true); else _g164.h["saturn.client.programs.EmptyViewer"] = true;
		value163 = _g164;
		if(__map_reserved.programs != null) _g154.setReserved("programs",value163); else _g154.h["programs"] = value163;
		value153 = _g154;
		if(__map_reserved["saturn.core.domain.SgcAllelePlate"] != null) _g.setReserved("saturn.core.domain.SgcAllelePlate",value153); else _g.h["saturn.core.domain.SgcAllelePlate"] = value153;
		var value164;
		var _g165 = new haxe.ds.StringMap();
		var value165;
		var _g166 = new haxe.ds.StringMap();
		if(__map_reserved.dnaId != null) _g166.setReserved("dnaId","DNA_ID"); else _g166.h["dnaId"] = "DNA_ID";
		if(__map_reserved.id != null) _g166.setReserved("id","PKEY"); else _g166.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g166.setReserved("dnaSeq","DNASEQUENCE"); else _g166.h["dnaSeq"] = "DNASEQUENCE";
		value165 = _g166;
		if(__map_reserved.fields != null) _g165.setReserved("fields",value165); else _g165.h["fields"] = value165;
		var value166;
		var _g167 = new haxe.ds.StringMap();
		if(__map_reserved.dnaId != null) _g167.setReserved("dnaId",false); else _g167.h["dnaId"] = false;
		if(__map_reserved.id != null) _g167.setReserved("id",true); else _g167.h["id"] = true;
		value166 = _g167;
		if(__map_reserved.indexes != null) _g165.setReserved("indexes",value166); else _g165.h["indexes"] = value166;
		var value167;
		var _g168 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g168.setReserved("schema","SGC"); else _g168.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g168.setReserved("name","DNA"); else _g168.h["name"] = "DNA";
		value167 = _g168;
		if(__map_reserved.table_info != null) _g165.setReserved("table_info",value167); else _g165.h["table_info"] = value167;
		value164 = _g165;
		if(__map_reserved["saturn.core.domain.SgcDNA"] != null) _g.setReserved("saturn.core.domain.SgcDNA",value164); else _g.h["saturn.core.domain.SgcDNA"] = value164;
		var value168;
		var _g169 = new haxe.ds.StringMap();
		var value169;
		var _g170 = new haxe.ds.StringMap();
		if(__map_reserved.pageId != null) _g170.setReserved("pageId","PAGEID"); else _g170.h["pageId"] = "PAGEID";
		if(__map_reserved.id != null) _g170.setReserved("id","PKEY"); else _g170.h["id"] = "PKEY";
		if(__map_reserved.content != null) _g170.setReserved("content","CONTENT"); else _g170.h["content"] = "CONTENT";
		value169 = _g170;
		if(__map_reserved.fields != null) _g169.setReserved("fields",value169); else _g169.h["fields"] = value169;
		var value170;
		var _g171 = new haxe.ds.StringMap();
		if(__map_reserved.pageId != null) _g171.setReserved("pageId",false); else _g171.h["pageId"] = false;
		if(__map_reserved.id != null) _g171.setReserved("id",true); else _g171.h["id"] = true;
		value170 = _g171;
		if(__map_reserved.indexes != null) _g169.setReserved("indexes",value170); else _g169.h["indexes"] = value170;
		var value171;
		var _g172 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g172.setReserved("schema","SGC"); else _g172.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g172.setReserved("name","TIDDLY_WIKI"); else _g172.h["name"] = "TIDDLY_WIKI";
		value171 = _g172;
		if(__map_reserved.table_info != null) _g169.setReserved("table_info",value171); else _g169.h["table_info"] = value171;
		var value172;
		var _g173 = new haxe.ds.StringMap();
		if(__map_reserved.icon != null) _g173.setReserved("icon","eln_16.png"); else _g173.h["icon"] = "eln_16.png";
		if(__map_reserved.alias != null) _g173.setReserved("alias","ELN Pages"); else _g173.h["alias"] = "ELN Pages";
		if(__map_reserved["file.new.label"] != null) _g173.setReserved("file.new.label","ELN Page"); else _g173.h["file.new.label"] = "ELN Page";
		if(__map_reserved.id_pattern != null) _g173.setReserved("id_pattern","wiki-"); else _g173.h["id_pattern"] = "wiki-";
		if(__map_reserved.strip_id_prefix != null) _g173.setReserved("strip_id_prefix",true); else _g173.h["strip_id_prefix"] = true;
		value172 = _g173;
		if(__map_reserved.options != null) _g169.setReserved("options",value172); else _g169.h["options"] = value172;
		var value173;
		var _g174 = new haxe.ds.StringMap();
		if(__map_reserved.pageId != null) _g174.setReserved("pageId",true); else _g174.h["pageId"] = true;
		value173 = _g174;
		if(__map_reserved.search != null) _g169.setReserved("search",value173); else _g169.h["search"] = value173;
		var value174;
		var _g175 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.TiddlyWikiViewer"] != null) _g175.setReserved("saturn.client.programs.TiddlyWikiViewer",true); else _g175.h["saturn.client.programs.TiddlyWikiViewer"] = true;
		value174 = _g175;
		if(__map_reserved.programs != null) _g169.setReserved("programs",value174); else _g169.h["programs"] = value174;
		value168 = _g169;
		if(__map_reserved["saturn.core.domain.TiddlyWiki"] != null) _g.setReserved("saturn.core.domain.TiddlyWiki",value168); else _g.h["saturn.core.domain.TiddlyWiki"] = value168;
		var value175;
		var _g176 = new haxe.ds.StringMap();
		var value176;
		var _g177 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g177.setReserved("id","PKEY"); else _g177.h["id"] = "PKEY";
		if(__map_reserved.entityId != null) _g177.setReserved("entityId","ID"); else _g177.h["entityId"] = "ID";
		if(__map_reserved.dataSourceId != null) _g177.setReserved("dataSourceId","SOURCE_PKEY"); else _g177.h["dataSourceId"] = "SOURCE_PKEY";
		if(__map_reserved.reactionId != null) _g177.setReserved("reactionId","SGCREACTION_PKEY"); else _g177.h["reactionId"] = "SGCREACTION_PKEY";
		if(__map_reserved.entityTypeId != null) _g177.setReserved("entityTypeId","SGCENTITY_TYPE"); else _g177.h["entityTypeId"] = "SGCENTITY_TYPE";
		if(__map_reserved.altName != null) _g177.setReserved("altName","ALTNAME"); else _g177.h["altName"] = "ALTNAME";
		if(__map_reserved.description != null) _g177.setReserved("description","DESCRIPTION"); else _g177.h["description"] = "DESCRIPTION";
		value176 = _g177;
		if(__map_reserved.fields != null) _g176.setReserved("fields",value176); else _g176.h["fields"] = value176;
		var value177;
		var _g178 = new haxe.ds.StringMap();
		if(__map_reserved.entityId != null) _g178.setReserved("entityId",false); else _g178.h["entityId"] = false;
		if(__map_reserved.id != null) _g178.setReserved("id",true); else _g178.h["id"] = true;
		value177 = _g178;
		if(__map_reserved.indexes != null) _g176.setReserved("indexes",value177); else _g176.h["indexes"] = value177;
		var value178;
		var _g179 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g179.setReserved("schema","SGC"); else _g179.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g179.setReserved("name","Z_ENTITY"); else _g179.h["name"] = "Z_ENTITY";
		value178 = _g179;
		if(__map_reserved.table_info != null) _g176.setReserved("table_info",value178); else _g176.h["table_info"] = value178;
		var value179;
		var _g180 = new haxe.ds.StringMap();
		var value180;
		var _g181 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g181.setReserved("field","dataSourceId"); else _g181.h["field"] = "dataSourceId";
		if(__map_reserved["class"] != null) _g181.setReserved("class","saturn.core.domain.DataSource"); else _g181.h["class"] = "saturn.core.domain.DataSource";
		if(__map_reserved.fk_field != null) _g181.setReserved("fk_field","id"); else _g181.h["fk_field"] = "id";
		value180 = _g181;
		_g180.set("source",value180);
		var value181;
		var _g182 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g182.setReserved("field","reactionId"); else _g182.h["field"] = "reactionId";
		if(__map_reserved["class"] != null) _g182.setReserved("class","saturn.core.Reaction"); else _g182.h["class"] = "saturn.core.Reaction";
		if(__map_reserved.fk_field != null) _g182.setReserved("fk_field","id"); else _g182.h["fk_field"] = "id";
		value181 = _g182;
		_g180.set("reaction",value181);
		var value182;
		var _g183 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g183.setReserved("field","entityTypeId"); else _g183.h["field"] = "entityTypeId";
		if(__map_reserved["class"] != null) _g183.setReserved("class","saturn.core.EntityType"); else _g183.h["class"] = "saturn.core.EntityType";
		if(__map_reserved.fk_field != null) _g183.setReserved("fk_field","id"); else _g183.h["fk_field"] = "id";
		value182 = _g183;
		_g180.set("entityType",value182);
		value179 = _g180;
		if(__map_reserved["fields.synthetic"] != null) _g176.setReserved("fields.synthetic",value179); else _g176.h["fields.synthetic"] = value179;
		value175 = _g176;
		if(__map_reserved["saturn.core.domain.Entity"] != null) _g.setReserved("saturn.core.domain.Entity",value175); else _g.h["saturn.core.domain.Entity"] = value175;
		var value183;
		var _g184 = new haxe.ds.StringMap();
		var value184;
		var _g185 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g185.setReserved("id","PKEY"); else _g185.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g185.setReserved("name","ID"); else _g185.h["name"] = "ID";
		if(__map_reserved.sequence != null) _g185.setReserved("sequence","LINEAR_SEQUENCE"); else _g185.h["sequence"] = "LINEAR_SEQUENCE";
		if(__map_reserved.entityId != null) _g185.setReserved("entityId","SGCENTITY_PKEY"); else _g185.h["entityId"] = "SGCENTITY_PKEY";
		value184 = _g185;
		if(__map_reserved.fields != null) _g184.setReserved("fields",value184); else _g184.h["fields"] = value184;
		var value185;
		var _g186 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g186.setReserved("name",false); else _g186.h["name"] = false;
		if(__map_reserved.id != null) _g186.setReserved("id",true); else _g186.h["id"] = true;
		value185 = _g186;
		if(__map_reserved.indexes != null) _g184.setReserved("indexes",value185); else _g184.h["indexes"] = value185;
		var value186;
		var _g187 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g187.setReserved("schema","SGC"); else _g187.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g187.setReserved("name","Z_MOLECULE"); else _g187.h["name"] = "Z_MOLECULE";
		value186 = _g187;
		if(__map_reserved.table_info != null) _g184.setReserved("table_info",value186); else _g184.h["table_info"] = value186;
		var value187;
		var _g188 = new haxe.ds.StringMap();
		var value188;
		var _g189 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g189.setReserved("field","entityId"); else _g189.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g189.setReserved("class","saturn.core.Entity"); else _g189.h["class"] = "saturn.core.Entity";
		if(__map_reserved.fk_field != null) _g189.setReserved("fk_field","id"); else _g189.h["fk_field"] = "id";
		value188 = _g189;
		_g188.set("entity",value188);
		value187 = _g188;
		if(__map_reserved["fields.synthetic"] != null) _g184.setReserved("fields.synthetic",value187); else _g184.h["fields.synthetic"] = value187;
		value183 = _g184;
		if(__map_reserved["saturn.core.domain.Molecule"] != null) _g.setReserved("saturn.core.domain.Molecule",value183); else _g.h["saturn.core.domain.Molecule"] = value183;
		var value189;
		var _g190 = new haxe.ds.StringMap();
		var value190;
		var _g191 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g191.setReserved("id","PKEY"); else _g191.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g191.setReserved("name","NAME"); else _g191.h["name"] = "NAME";
		value190 = _g191;
		if(__map_reserved.fields != null) _g190.setReserved("fields",value190); else _g190.h["fields"] = value190;
		var value191;
		var _g192 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g192.setReserved("name",false); else _g192.h["name"] = false;
		if(__map_reserved.id != null) _g192.setReserved("id",true); else _g192.h["id"] = true;
		value191 = _g192;
		if(__map_reserved.indexes != null) _g190.setReserved("indexes",value191); else _g190.h["indexes"] = value191;
		var value192;
		var _g193 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g193.setReserved("schema","SGC"); else _g193.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g193.setReserved("name","Z_REACTION_TYPE"); else _g193.h["name"] = "Z_REACTION_TYPE";
		value192 = _g193;
		if(__map_reserved.table_info != null) _g190.setReserved("table_info",value192); else _g190.h["table_info"] = value192;
		value189 = _g190;
		if(__map_reserved["saturn.core.ReactionType"] != null) _g.setReserved("saturn.core.ReactionType",value189); else _g.h["saturn.core.ReactionType"] = value189;
		var value193;
		var _g194 = new haxe.ds.StringMap();
		var value194;
		var _g195 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g195.setReserved("id","PKEY"); else _g195.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g195.setReserved("name","NAME"); else _g195.h["name"] = "NAME";
		value194 = _g195;
		if(__map_reserved.fields != null) _g194.setReserved("fields",value194); else _g194.h["fields"] = value194;
		var value195;
		var _g196 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g196.setReserved("name",false); else _g196.h["name"] = false;
		if(__map_reserved.id != null) _g196.setReserved("id",true); else _g196.h["id"] = true;
		value195 = _g196;
		if(__map_reserved.indexes != null) _g194.setReserved("indexes",value195); else _g194.h["indexes"] = value195;
		var value196;
		var _g197 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g197.setReserved("schema","SGC"); else _g197.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g197.setReserved("name","Z_ENTITY_TYPE"); else _g197.h["name"] = "Z_ENTITY_TYPE";
		value196 = _g197;
		if(__map_reserved.table_info != null) _g194.setReserved("table_info",value196); else _g194.h["table_info"] = value196;
		value193 = _g194;
		if(__map_reserved["saturn.core.EntityType"] != null) _g.setReserved("saturn.core.EntityType",value193); else _g.h["saturn.core.EntityType"] = value193;
		var value197;
		var _g198 = new haxe.ds.StringMap();
		var value198;
		var _g199 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g199.setReserved("id","PKEY"); else _g199.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g199.setReserved("name","NAME"); else _g199.h["name"] = "NAME";
		value198 = _g199;
		if(__map_reserved.fields != null) _g198.setReserved("fields",value198); else _g198.h["fields"] = value198;
		var value199;
		var _g200 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g200.setReserved("name",false); else _g200.h["name"] = false;
		if(__map_reserved.id != null) _g200.setReserved("id",true); else _g200.h["id"] = true;
		value199 = _g200;
		if(__map_reserved.indexes != null) _g198.setReserved("indexes",value199); else _g198.h["indexes"] = value199;
		var value200;
		var _g201 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g201.setReserved("schema","SGC"); else _g201.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g201.setReserved("name","Z_REACTION_ROLE"); else _g201.h["name"] = "Z_REACTION_ROLE";
		value200 = _g201;
		if(__map_reserved.table_info != null) _g198.setReserved("table_info",value200); else _g198.h["table_info"] = value200;
		value197 = _g198;
		if(__map_reserved["saturn.core.ReactionRole"] != null) _g.setReserved("saturn.core.ReactionRole",value197); else _g.h["saturn.core.ReactionRole"] = value197;
		var value201;
		var _g202 = new haxe.ds.StringMap();
		var value202;
		var _g203 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g203.setReserved("id","PKEY"); else _g203.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g203.setReserved("name","NAME"); else _g203.h["name"] = "NAME";
		if(__map_reserved.reactionTypeId != null) _g203.setReserved("reactionTypeId","SGCREACTION_TYPE"); else _g203.h["reactionTypeId"] = "SGCREACTION_TYPE";
		value202 = _g203;
		if(__map_reserved.fields != null) _g202.setReserved("fields",value202); else _g202.h["fields"] = value202;
		var value203;
		var _g204 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g204.setReserved("name",false); else _g204.h["name"] = false;
		if(__map_reserved.id != null) _g204.setReserved("id",true); else _g204.h["id"] = true;
		value203 = _g204;
		if(__map_reserved.indexes != null) _g202.setReserved("indexes",value203); else _g202.h["indexes"] = value203;
		var value204;
		var _g205 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g205.setReserved("schema","SGC"); else _g205.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g205.setReserved("name","Z_REACTION"); else _g205.h["name"] = "Z_REACTION";
		value204 = _g205;
		if(__map_reserved.table_info != null) _g202.setReserved("table_info",value204); else _g202.h["table_info"] = value204;
		var value205;
		var _g206 = new haxe.ds.StringMap();
		var value206;
		var _g207 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g207.setReserved("field","reactionTypeId"); else _g207.h["field"] = "reactionTypeId";
		if(__map_reserved["class"] != null) _g207.setReserved("class","saturn.core.ReactionType"); else _g207.h["class"] = "saturn.core.ReactionType";
		if(__map_reserved.fk_field != null) _g207.setReserved("fk_field","id"); else _g207.h["fk_field"] = "id";
		value206 = _g207;
		_g206.set("reactionType",value206);
		value205 = _g206;
		if(__map_reserved["fields.synthetic"] != null) _g202.setReserved("fields.synthetic",value205); else _g202.h["fields.synthetic"] = value205;
		value201 = _g202;
		if(__map_reserved["saturn.core.Reaction"] != null) _g.setReserved("saturn.core.Reaction",value201); else _g.h["saturn.core.Reaction"] = value201;
		var value207;
		var _g208 = new haxe.ds.StringMap();
		var value208;
		var _g209 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g209.setReserved("id","PKEY"); else _g209.h["id"] = "PKEY";
		if(__map_reserved.reactionRoleId != null) _g209.setReserved("reactionRoleId","SGCROLE_PKEY"); else _g209.h["reactionRoleId"] = "SGCROLE_PKEY";
		if(__map_reserved.entityId != null) _g209.setReserved("entityId","SGCENTITY_PKEY"); else _g209.h["entityId"] = "SGCENTITY_PKEY";
		if(__map_reserved.reactionId != null) _g209.setReserved("reactionId","SGCREACTION_PKEY"); else _g209.h["reactionId"] = "SGCREACTION_PKEY";
		if(__map_reserved.position != null) _g209.setReserved("position","POSITION"); else _g209.h["position"] = "POSITION";
		value208 = _g209;
		if(__map_reserved.fields != null) _g208.setReserved("fields",value208); else _g208.h["fields"] = value208;
		var value209;
		var _g210 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g210.setReserved("id",true); else _g210.h["id"] = true;
		value209 = _g210;
		if(__map_reserved.indexes != null) _g208.setReserved("indexes",value209); else _g208.h["indexes"] = value209;
		var value210;
		var _g211 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g211.setReserved("schema","SGC"); else _g211.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g211.setReserved("name","Z_REACTION_COMPONENT"); else _g211.h["name"] = "Z_REACTION_COMPONENT";
		value210 = _g211;
		if(__map_reserved.table_info != null) _g208.setReserved("table_info",value210); else _g208.h["table_info"] = value210;
		var value211;
		var _g212 = new haxe.ds.StringMap();
		var value212;
		var _g213 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g213.setReserved("field","reactionRoleId"); else _g213.h["field"] = "reactionRoleId";
		if(__map_reserved["class"] != null) _g213.setReserved("class","saturn.core.ReactionRole"); else _g213.h["class"] = "saturn.core.ReactionRole";
		if(__map_reserved.fk_field != null) _g213.setReserved("fk_field","id"); else _g213.h["fk_field"] = "id";
		value212 = _g213;
		_g212.set("reactionRole",value212);
		var value213;
		var _g214 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g214.setReserved("field","reactionId"); else _g214.h["field"] = "reactionId";
		if(__map_reserved["class"] != null) _g214.setReserved("class","saturn.core.Reaction"); else _g214.h["class"] = "saturn.core.Reaction";
		if(__map_reserved.fk_field != null) _g214.setReserved("fk_field","id"); else _g214.h["fk_field"] = "id";
		value213 = _g214;
		_g212.set("reaction",value213);
		var value214;
		var _g215 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g215.setReserved("field","entityId"); else _g215.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g215.setReserved("class","saturn.core.Entity"); else _g215.h["class"] = "saturn.core.Entity";
		if(__map_reserved.fk_field != null) _g215.setReserved("fk_field","id"); else _g215.h["fk_field"] = "id";
		value214 = _g215;
		_g212.set("entity",value214);
		value211 = _g212;
		if(__map_reserved["fields.synthetic"] != null) _g208.setReserved("fields.synthetic",value211); else _g208.h["fields.synthetic"] = value211;
		value207 = _g208;
		if(__map_reserved["saturn.core.ReactionComponent"] != null) _g.setReserved("saturn.core.ReactionComponent",value207); else _g.h["saturn.core.ReactionComponent"] = value207;
		var value215;
		var _g216 = new haxe.ds.StringMap();
		var value216;
		var _g217 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g217.setReserved("id","PKEY"); else _g217.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g217.setReserved("name","NAME"); else _g217.h["name"] = "NAME";
		value216 = _g217;
		if(__map_reserved.fields != null) _g216.setReserved("fields",value216); else _g216.h["fields"] = value216;
		var value217;
		var _g218 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g218.setReserved("name",false); else _g218.h["name"] = false;
		if(__map_reserved.id != null) _g218.setReserved("id",true); else _g218.h["id"] = true;
		value217 = _g218;
		if(__map_reserved.indexes != null) _g216.setReserved("indexes",value217); else _g216.h["indexes"] = value217;
		var value218;
		var _g219 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g219.setReserved("schema","SGC"); else _g219.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g219.setReserved("name","Z_ENTITY_SOURCE"); else _g219.h["name"] = "Z_ENTITY_SOURCE";
		value218 = _g219;
		if(__map_reserved.table_info != null) _g216.setReserved("table_info",value218); else _g216.h["table_info"] = value218;
		value215 = _g216;
		if(__map_reserved["saturn.core.domain.DataSource"] != null) _g.setReserved("saturn.core.domain.DataSource",value215); else _g.h["saturn.core.domain.DataSource"] = value215;
		var value219;
		var _g220 = new haxe.ds.StringMap();
		var value220;
		var _g221 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g221.setReserved("id","PKEY"); else _g221.h["id"] = "PKEY";
		if(__map_reserved.entityId != null) _g221.setReserved("entityId","SGCENTITY_PKEY"); else _g221.h["entityId"] = "SGCENTITY_PKEY";
		if(__map_reserved.labelId != null) _g221.setReserved("labelId","XREF_SGCENTITY_PKEY"); else _g221.h["labelId"] = "XREF_SGCENTITY_PKEY";
		if(__map_reserved.start != null) _g221.setReserved("start","STARTPOS"); else _g221.h["start"] = "STARTPOS";
		if(__map_reserved.stop != null) _g221.setReserved("stop","STOPPOS"); else _g221.h["stop"] = "STOPPOS";
		if(__map_reserved.evalue != null) _g221.setReserved("evalue","EVALUE"); else _g221.h["evalue"] = "EVALUE";
		value220 = _g221;
		if(__map_reserved.fields != null) _g220.setReserved("fields",value220); else _g220.h["fields"] = value220;
		var value221;
		var _g222 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g222.setReserved("id",true); else _g222.h["id"] = true;
		value221 = _g222;
		if(__map_reserved.indexes != null) _g220.setReserved("indexes",value221); else _g220.h["indexes"] = value221;
		var value222;
		var _g223 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g223.setReserved("schema","SGC"); else _g223.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g223.setReserved("name","Z_ANNOTATION"); else _g223.h["name"] = "Z_ANNOTATION";
		value222 = _g223;
		if(__map_reserved.table_info != null) _g220.setReserved("table_info",value222); else _g220.h["table_info"] = value222;
		var value223;
		var _g224 = new haxe.ds.StringMap();
		var value224;
		var _g225 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g225.setReserved("field","entityId"); else _g225.h["field"] = "entityId";
		if(__map_reserved["class"] != null) _g225.setReserved("class","saturn.core.domain.Entity"); else _g225.h["class"] = "saturn.core.domain.Entity";
		if(__map_reserved.fk_field != null) _g225.setReserved("fk_field","id"); else _g225.h["fk_field"] = "id";
		value224 = _g225;
		_g224.set("entity",value224);
		var value225;
		var _g226 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g226.setReserved("field","labelId"); else _g226.h["field"] = "labelId";
		if(__map_reserved["class"] != null) _g226.setReserved("class","saturn.core.domain.Entity"); else _g226.h["class"] = "saturn.core.domain.Entity";
		if(__map_reserved.fk_field != null) _g226.setReserved("fk_field","id"); else _g226.h["fk_field"] = "id";
		value225 = _g226;
		_g224.set("referent",value225);
		value223 = _g224;
		if(__map_reserved["fields.synthetic"] != null) _g220.setReserved("fields.synthetic",value223); else _g220.h["fields.synthetic"] = value223;
		value219 = _g220;
		if(__map_reserved["saturn.core.domain.MoleculeAnnotation"] != null) _g.setReserved("saturn.core.domain.MoleculeAnnotation",value219); else _g.h["saturn.core.domain.MoleculeAnnotation"] = value219;
		var value226;
		var _g227 = new haxe.ds.StringMap();
		var value227;
		var _g228 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g228.setReserved("id","PKEY"); else _g228.h["id"] = "PKEY";
		if(__map_reserved.barcode != null) _g228.setReserved("barcode","BARCODE"); else _g228.h["barcode"] = "BARCODE";
		if(__map_reserved.purificationId != null) _g228.setReserved("purificationId","SGCPURIFICATION_PKEY"); else _g228.h["purificationId"] = "SGCPURIFICATION_PKEY";
		value227 = _g228;
		if(__map_reserved.fields != null) _g227.setReserved("fields",value227); else _g227.h["fields"] = value227;
		var value228;
		var _g229 = new haxe.ds.StringMap();
		if(__map_reserved.barcode != null) _g229.setReserved("barcode",false); else _g229.h["barcode"] = false;
		if(__map_reserved.id != null) _g229.setReserved("id",true); else _g229.h["id"] = true;
		value228 = _g229;
		if(__map_reserved.indexes != null) _g227.setReserved("indexes",value228); else _g227.h["indexes"] = value228;
		var value229;
		var _g230 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g230.setReserved("schema","SGC"); else _g230.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g230.setReserved("name","XTAL_PLATES"); else _g230.h["name"] = "XTAL_PLATES";
		value229 = _g230;
		if(__map_reserved.table_info != null) _g227.setReserved("table_info",value229); else _g227.h["table_info"] = value229;
		var value230;
		var _g231 = new haxe.ds.StringMap();
		var value231;
		var _g232 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g232.setReserved("field","purificationId"); else _g232.h["field"] = "purificationId";
		if(__map_reserved["class"] != null) _g232.setReserved("class","saturn.core.domain.SgcPurification"); else _g232.h["class"] = "saturn.core.domain.SgcPurification";
		if(__map_reserved.fk_field != null) _g232.setReserved("fk_field","id"); else _g232.h["fk_field"] = "id";
		value231 = _g232;
		_g231.set("purification",value231);
		value230 = _g231;
		if(__map_reserved["fields.synthetic"] != null) _g227.setReserved("fields.synthetic",value230); else _g227.h["fields.synthetic"] = value230;
		var value232;
		var _g233 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g233.setReserved("alias","Xtal Plates"); else _g233.h["alias"] = "Xtal Plates";
		value232 = _g233;
		if(__map_reserved.options != null) _g227.setReserved("options",value232); else _g227.h["options"] = value232;
		value226 = _g227;
		if(__map_reserved["saturn.core.domain.XtalPlate"] != null) _g.setReserved("saturn.core.domain.XtalPlate",value226); else _g.h["saturn.core.domain.XtalPlate"] = value226;
		var value233;
		var _g234 = new haxe.ds.StringMap();
		var value234;
		var _g235 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g235.setReserved("id","PKEY"); else _g235.h["id"] = "PKEY";
		if(__map_reserved.modelId != null) _g235.setReserved("modelId","MODELID"); else _g235.h["modelId"] = "MODELID";
		if(__map_reserved.pathToPdb != null) _g235.setReserved("pathToPdb","PATHTOPDB"); else _g235.h["pathToPdb"] = "PATHTOPDB";
		value234 = _g235;
		if(__map_reserved.fields != null) _g234.setReserved("fields",value234); else _g234.h["fields"] = value234;
		var value235;
		var _g236 = new haxe.ds.StringMap();
		if(__map_reserved.modelId != null) _g236.setReserved("modelId",false); else _g236.h["modelId"] = false;
		if(__map_reserved.id != null) _g236.setReserved("id",true); else _g236.h["id"] = true;
		value235 = _g236;
		if(__map_reserved.indexes != null) _g234.setReserved("indexes",value235); else _g234.h["indexes"] = value235;
		var value236;
		var _g237 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g237.setReserved("schema","SGC"); else _g237.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g237.setReserved("name","MODEL"); else _g237.h["name"] = "MODEL";
		value236 = _g237;
		if(__map_reserved.table_info != null) _g234.setReserved("table_info",value236); else _g234.h["table_info"] = value236;
		var value237;
		var _g238 = new haxe.ds.StringMap();
		var value238;
		var _g239 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g239.setReserved("field","pathToPdb"); else _g239.h["field"] = "pathToPdb";
		if(__map_reserved["class"] != null) _g239.setReserved("class","saturn.core.domain.FileProxy"); else _g239.h["class"] = "saturn.core.domain.FileProxy";
		if(__map_reserved.fk_field != null) _g239.setReserved("fk_field","path"); else _g239.h["fk_field"] = "path";
		value238 = _g239;
		_g238.set("pdb",value238);
		value237 = _g238;
		if(__map_reserved["fields.synthetic"] != null) _g234.setReserved("fields.synthetic",value237); else _g234.h["fields.synthetic"] = value237;
		var value239;
		var _g240 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g240.setReserved("id_pattern","\\w+-m"); else _g240.h["id_pattern"] = "\\w+-m";
		if(__map_reserved.workspace_wrapper != null) _g240.setReserved("workspace_wrapper","saturn.client.workspace.StructureModelWO"); else _g240.h["workspace_wrapper"] = "saturn.client.workspace.StructureModelWO";
		if(__map_reserved.icon != null) _g240.setReserved("icon","structure_16.png"); else _g240.h["icon"] = "structure_16.png";
		if(__map_reserved.alias != null) _g240.setReserved("alias","Models"); else _g240.h["alias"] = "Models";
		value239 = _g240;
		if(__map_reserved.options != null) _g234.setReserved("options",value239); else _g234.h["options"] = value239;
		var value240;
		var _g241 = new haxe.ds.StringMap();
		if(__map_reserved.modelId != null) _g241.setReserved("modelId","\\w+-m"); else _g241.h["modelId"] = "\\w+-m";
		value240 = _g241;
		if(__map_reserved.search != null) _g234.setReserved("search",value240); else _g234.h["search"] = value240;
		var value241;
		var _g242 = new haxe.ds.StringMap();
		if(__map_reserved["Model ID"] != null) _g242.setReserved("Model ID","modelId"); else _g242.h["Model ID"] = "modelId";
		if(__map_reserved["Path to PDB"] != null) _g242.setReserved("Path to PDB","pathToPdb"); else _g242.h["Path to PDB"] = "pathToPdb";
		value241 = _g242;
		if(__map_reserved.model != null) _g234.setReserved("model",value241); else _g234.h["model"] = value241;
		value233 = _g234;
		if(__map_reserved["saturn.core.domain.StructureModel"] != null) _g.setReserved("saturn.core.domain.StructureModel",value233); else _g.h["saturn.core.domain.StructureModel"] = value233;
		var value242;
		var _g243 = new haxe.ds.StringMap();
		var value243;
		var _g244 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g244.setReserved("path","PATH"); else _g244.h["path"] = "PATH";
		if(__map_reserved.content != null) _g244.setReserved("content","CONTENT"); else _g244.h["content"] = "CONTENT";
		value243 = _g244;
		if(__map_reserved.fields != null) _g243.setReserved("fields",value243); else _g243.h["fields"] = value243;
		var value244;
		var _g245 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g245.setReserved("path",true); else _g245.h["path"] = true;
		value244 = _g245;
		if(__map_reserved.indexes != null) _g243.setReserved("indexes",value244); else _g243.h["indexes"] = value244;
		var value245;
		var _g246 = new haxe.ds.StringMap();
		var value246;
		var _g247 = new haxe.ds.StringMap();
		if(__map_reserved["/work"] != null) _g247.setReserved("/work","W:"); else _g247.h["/work"] = "W:";
		if(__map_reserved["/home/share"] != null) _g247.setReserved("/home/share","S:"); else _g247.h["/home/share"] = "S:";
		value246 = _g247;
		_g246.set("windows_conversions",value246);
		var value247;
		var _g248 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g248.setReserved("WORK","^W"); else _g248.h["WORK"] = "^W";
		value247 = _g248;
		_g246.set("windows_allowed_paths_regex",value247);
		var value248;
		var _g249 = new haxe.ds.StringMap();
		if(__map_reserved["W:"] != null) _g249.setReserved("W:","/work"); else _g249.h["W:"] = "/work";
		value248 = _g249;
		_g246.set("linux_conversions",value248);
		var value249;
		var _g250 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g250.setReserved("WORK","^/work"); else _g250.h["WORK"] = "^/work";
		value249 = _g250;
		_g246.set("linux_allowed_paths_regex",value249);
		value245 = _g246;
		if(__map_reserved.options != null) _g243.setReserved("options",value245); else _g243.h["options"] = value245;
		value242 = _g243;
		if(__map_reserved["saturn.core.domain.FileProxy"] != null) _g.setReserved("saturn.core.domain.FileProxy",value242); else _g.h["saturn.core.domain.FileProxy"] = value242;
		var value250;
		var _g251 = new haxe.ds.StringMap();
		var value251;
		var _g252 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g252.setReserved("moleculeName","NAME"); else _g252.h["moleculeName"] = "NAME";
		value251 = _g252;
		if(__map_reserved.fields != null) _g251.setReserved("fields",value251); else _g251.h["fields"] = value251;
		var value252;
		var _g253 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g253.setReserved("moleculeName",true); else _g253.h["moleculeName"] = true;
		value252 = _g253;
		if(__map_reserved.indexes != null) _g251.setReserved("indexes",value252); else _g251.h["indexes"] = value252;
		var value253;
		var _g254 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g254.setReserved("saturn.client.programs.DNASequenceEditor",false); else _g254.h["saturn.client.programs.DNASequenceEditor"] = false;
		value253 = _g254;
		if(__map_reserved.programs != null) _g251.setReserved("programs",value253); else _g251.h["programs"] = value253;
		var value254;
		var _g255 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g255.setReserved("alias","DNA"); else _g255.h["alias"] = "DNA";
		if(__map_reserved.icon != null) _g255.setReserved("icon","dna_conical_16.png"); else _g255.h["icon"] = "dna_conical_16.png";
		value254 = _g255;
		if(__map_reserved.options != null) _g251.setReserved("options",value254); else _g251.h["options"] = value254;
		value250 = _g251;
		if(__map_reserved["saturn.core.DNA"] != null) _g.setReserved("saturn.core.DNA",value250); else _g.h["saturn.core.DNA"] = value250;
		var value255;
		var _g256 = new haxe.ds.StringMap();
		var value256;
		var _g257 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g257.setReserved("moleculeName","NAME"); else _g257.h["moleculeName"] = "NAME";
		value256 = _g257;
		if(__map_reserved.fields != null) _g256.setReserved("fields",value256); else _g256.h["fields"] = value256;
		var value257;
		var _g258 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g258.setReserved("moleculeName",true); else _g258.h["moleculeName"] = true;
		value257 = _g258;
		if(__map_reserved.indexes != null) _g256.setReserved("indexes",value257); else _g256.h["indexes"] = value257;
		var value258;
		var _g259 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g259.setReserved("saturn.client.programs.ProteinSequenceEditor",false); else _g259.h["saturn.client.programs.ProteinSequenceEditor"] = false;
		value258 = _g259;
		if(__map_reserved.programs != null) _g256.setReserved("programs",value258); else _g256.h["programs"] = value258;
		var value259;
		var _g260 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g260.setReserved("alias","Proteins"); else _g260.h["alias"] = "Proteins";
		if(__map_reserved.icon != null) _g260.setReserved("icon","structure_16.png"); else _g260.h["icon"] = "structure_16.png";
		value259 = _g260;
		if(__map_reserved.options != null) _g256.setReserved("options",value259); else _g256.h["options"] = value259;
		value255 = _g256;
		if(__map_reserved["saturn.core.Protein"] != null) _g.setReserved("saturn.core.Protein",value255); else _g.h["saturn.core.Protein"] = value255;
		var value260;
		var _g261 = new haxe.ds.StringMap();
		var value261;
		var _g262 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g262.setReserved("id","PKEY"); else _g262.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g262.setReserved("name","NAME"); else _g262.h["name"] = "NAME";
		if(__map_reserved.value != null) _g262.setReserved("value","VALUE"); else _g262.h["value"] = "VALUE";
		value261 = _g262;
		if(__map_reserved.fields != null) _g261.setReserved("fields",value261); else _g261.h["fields"] = value261;
		var value262;
		var _g263 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g263.setReserved("name",false); else _g263.h["name"] = false;
		if(__map_reserved.id != null) _g263.setReserved("id",true); else _g263.h["id"] = true;
		value262 = _g263;
		if(__map_reserved.indexes != null) _g261.setReserved("indexes",value262); else _g261.h["indexes"] = value262;
		var value263;
		var _g264 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.TextEditor"] != null) _g264.setReserved("saturn.client.programs.TextEditor",true); else _g264.h["saturn.client.programs.TextEditor"] = true;
		value263 = _g264;
		if(__map_reserved.programs != null) _g261.setReserved("programs",value263); else _g261.h["programs"] = value263;
		var value264;
		var _g265 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g265.setReserved("alias","Scripts"); else _g265.h["alias"] = "Scripts";
		if(__map_reserved["file.new.label"] != null) _g265.setReserved("file.new.label","Script"); else _g265.h["file.new.label"] = "Script";
		if(__map_reserved.icon != null) _g265.setReserved("icon","dna_conical_16.png"); else _g265.h["icon"] = "dna_conical_16.png";
		value264 = _g265;
		if(__map_reserved.options != null) _g261.setReserved("options",value264); else _g261.h["options"] = value264;
		var value265;
		var _g266 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g266.setReserved("schema","SGC"); else _g266.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g266.setReserved("name","SCRIPTS"); else _g266.h["name"] = "SCRIPTS";
		value265 = _g266;
		if(__map_reserved.table_info != null) _g261.setReserved("table_info",value265); else _g261.h["table_info"] = value265;
		var value266;
		var _g267 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g267.setReserved("name",true); else _g267.h["name"] = true;
		value266 = _g267;
		if(__map_reserved.search != null) _g261.setReserved("search",value266); else _g261.h["search"] = value266;
		value260 = _g261;
		if(__map_reserved["saturn.core.domain.TextFile"] != null) _g.setReserved("saturn.core.domain.TextFile",value260); else _g.h["saturn.core.domain.TextFile"] = value260;
		var value267;
		var _g268 = new haxe.ds.StringMap();
		var value268;
		var _g269 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.BasicTableViewer"] != null) _g269.setReserved("saturn.client.programs.BasicTableViewer",true); else _g269.h["saturn.client.programs.BasicTableViewer"] = true;
		value268 = _g269;
		if(__map_reserved.programs != null) _g268.setReserved("programs",value268); else _g268.h["programs"] = value268;
		var value269;
		var _g270 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g270.setReserved("alias","Results"); else _g270.h["alias"] = "Results";
		value269 = _g270;
		if(__map_reserved.options != null) _g268.setReserved("options",value269); else _g268.h["options"] = value269;
		value267 = _g268;
		if(__map_reserved["saturn.core.BasicTable"] != null) _g.setReserved("saturn.core.BasicTable",value267); else _g.h["saturn.core.BasicTable"] = value267;
		var value270;
		var _g271 = new haxe.ds.StringMap();
		var value271;
		var _g272 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ConstructDesigner"] != null) _g272.setReserved("saturn.client.programs.ConstructDesigner",false); else _g272.h["saturn.client.programs.ConstructDesigner"] = false;
		value271 = _g272;
		if(__map_reserved.programs != null) _g271.setReserved("programs",value271); else _g271.h["programs"] = value271;
		var value272;
		var _g273 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g273.setReserved("alias","Construct Plan"); else _g273.h["alias"] = "Construct Plan";
		if(__map_reserved.icon != null) _g273.setReserved("icon","dna_conical_16.png"); else _g273.h["icon"] = "dna_conical_16.png";
		value272 = _g273;
		if(__map_reserved.options != null) _g271.setReserved("options",value272); else _g271.h["options"] = value272;
		value270 = _g271;
		if(__map_reserved["saturn.core.ConstructDesignTable"] != null) _g.setReserved("saturn.core.ConstructDesignTable",value270); else _g.h["saturn.core.ConstructDesignTable"] = value270;
		var value273;
		var _g274 = new haxe.ds.StringMap();
		var value274;
		var _g275 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.PurificationHelper"] != null) _g275.setReserved("saturn.client.programs.PurificationHelper",false); else _g275.h["saturn.client.programs.PurificationHelper"] = false;
		value274 = _g275;
		if(__map_reserved.programs != null) _g274.setReserved("programs",value274); else _g274.h["programs"] = value274;
		var value275;
		var _g276 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g276.setReserved("alias","Purifiaction Helper"); else _g276.h["alias"] = "Purifiaction Helper";
		value275 = _g276;
		if(__map_reserved.options != null) _g274.setReserved("options",value275); else _g274.h["options"] = value275;
		value273 = _g274;
		if(__map_reserved["saturn.core.PurificationHelperTable"] != null) _g.setReserved("saturn.core.PurificationHelperTable",value273); else _g.h["saturn.core.PurificationHelperTable"] = value273;
		var value276;
		var _g277 = new haxe.ds.StringMap();
		var value277;
		var _g278 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.SHRNADesigner"] != null) _g278.setReserved("saturn.client.programs.SHRNADesigner",false); else _g278.h["saturn.client.programs.SHRNADesigner"] = false;
		value277 = _g278;
		if(__map_reserved.programs != null) _g277.setReserved("programs",value277); else _g277.h["programs"] = value277;
		var value278;
		var _g279 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g279.setReserved("alias","shRNA Designer"); else _g279.h["alias"] = "shRNA Designer";
		if(__map_reserved.icon != null) _g279.setReserved("icon","shrna_16.png"); else _g279.h["icon"] = "shrna_16.png";
		value278 = _g279;
		if(__map_reserved.options != null) _g277.setReserved("options",value278); else _g277.h["options"] = value278;
		value276 = _g277;
		if(__map_reserved["saturn.core.SHRNADesignTable"] != null) _g.setReserved("saturn.core.SHRNADesignTable",value276); else _g.h["saturn.core.SHRNADesignTable"] = value276;
		var value279;
		var _g280 = new haxe.ds.StringMap();
		var value280;
		var _g281 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.BasicTableViewer"] != null) _g281.setReserved("saturn.client.programs.BasicTableViewer",false); else _g281.h["saturn.client.programs.BasicTableViewer"] = false;
		value280 = _g281;
		if(__map_reserved.programs != null) _g280.setReserved("programs",value280); else _g280.h["programs"] = value280;
		var value281;
		var _g282 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g282.setReserved("alias","Table"); else _g282.h["alias"] = "Table";
		value281 = _g282;
		if(__map_reserved.options != null) _g280.setReserved("options",value281); else _g280.h["options"] = value281;
		value279 = _g280;
		if(__map_reserved["saturn.core.Table"] != null) _g.setReserved("saturn.core.Table",value279); else _g.h["saturn.core.Table"] = value279;
		var value282;
		var _g283 = new haxe.ds.StringMap();
		var value283;
		var _g284 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g284.setReserved("id","PKEY"); else _g284.h["id"] = "PKEY";
		if(__map_reserved.compoundId != null) _g284.setReserved("compoundId","SGCGLOBALID"); else _g284.h["compoundId"] = "SGCGLOBALID";
		if(__map_reserved.shortCompoundId != null) _g284.setReserved("shortCompoundId","COMPOUND_ID"); else _g284.h["shortCompoundId"] = "COMPOUND_ID";
		if(__map_reserved.supplierId != null) _g284.setReserved("supplierId","SUPPLIER_ID"); else _g284.h["supplierId"] = "SUPPLIER_ID";
		if(__map_reserved.sdf != null) _g284.setReserved("sdf","SDF"); else _g284.h["sdf"] = "SDF";
		if(__map_reserved.supplier != null) _g284.setReserved("supplier","SUPPLIER"); else _g284.h["supplier"] = "SUPPLIER";
		if(__map_reserved.description != null) _g284.setReserved("description","DESCRIPTION"); else _g284.h["description"] = "DESCRIPTION";
		if(__map_reserved.concentration != null) _g284.setReserved("concentration","CONCENTRATION"); else _g284.h["concentration"] = "CONCENTRATION";
		if(__map_reserved.location != null) _g284.setReserved("location","LOCATION"); else _g284.h["location"] = "LOCATION";
		if(__map_reserved.comments != null) _g284.setReserved("comments","COMMENTS"); else _g284.h["comments"] = "COMMENTS";
		if(__map_reserved.solute != null) _g284.setReserved("solute","SOLUTE"); else _g284.h["solute"] = "SOLUTE";
		if(__map_reserved.mw != null) _g284.setReserved("mw","MW"); else _g284.h["mw"] = "MW";
		if(__map_reserved.confidential != null) _g284.setReserved("confidential","CONFIDENTIAL"); else _g284.h["confidential"] = "CONFIDENTIAL";
		if(__map_reserved.inchi != null) _g284.setReserved("inchi","INCHI"); else _g284.h["inchi"] = "INCHI";
		if(__map_reserved.smiles != null) _g284.setReserved("smiles","SMILES"); else _g284.h["smiles"] = "SMILES";
		if(__map_reserved.datestamp != null) _g284.setReserved("datestamp","DATESTAMP"); else _g284.h["datestamp"] = "DATESTAMP";
		if(__map_reserved.person != null) _g284.setReserved("person","PERSON"); else _g284.h["person"] = "PERSON";
		value283 = _g284;
		if(__map_reserved.fields != null) _g283.setReserved("fields",value283); else _g283.h["fields"] = value283;
		var value284;
		var _g285 = new haxe.ds.StringMap();
		if(__map_reserved.compoundId != null) _g285.setReserved("compoundId",false); else _g285.h["compoundId"] = false;
		if(__map_reserved.id != null) _g285.setReserved("id",true); else _g285.h["id"] = true;
		value284 = _g285;
		if(__map_reserved.indexes != null) _g283.setReserved("indexes",value284); else _g283.h["indexes"] = value284;
		var value285;
		var _g286 = new haxe.ds.StringMap();
		if(__map_reserved.compoundId != null) _g286.setReserved("compoundId",null); else _g286.h["compoundId"] = null;
		if(__map_reserved.shortCompoundId != null) _g286.setReserved("shortCompoundId",null); else _g286.h["shortCompoundId"] = null;
		if(__map_reserved.supplierId != null) _g286.setReserved("supplierId",null); else _g286.h["supplierId"] = null;
		if(__map_reserved.supplier != null) _g286.setReserved("supplier",null); else _g286.h["supplier"] = null;
		value285 = _g286;
		if(__map_reserved.search != null) _g283.setReserved("search",value285); else _g283.h["search"] = value285;
		var value286;
		var _g287 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g287.setReserved("schema","SGC"); else _g287.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g287.setReserved("name","SGCCOMPOUND"); else _g287.h["name"] = "SGCCOMPOUND";
		value286 = _g287;
		if(__map_reserved.table_info != null) _g283.setReserved("table_info",value286); else _g283.h["table_info"] = value286;
		var value287;
		var _g288 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g288.setReserved("id_pattern","^\\w{5}\\d{4}"); else _g288.h["id_pattern"] = "^\\w{5}\\d{4}";
		if(__map_reserved.workspace_wrapper != null) _g288.setReserved("workspace_wrapper","saturn.client.workspace.CompoundWO"); else _g288.h["workspace_wrapper"] = "saturn.client.workspace.CompoundWO";
		if(__map_reserved.icon != null) _g288.setReserved("icon","compound_16.png"); else _g288.h["icon"] = "compound_16.png";
		if(__map_reserved.alias != null) _g288.setReserved("alias","Compounds"); else _g288.h["alias"] = "Compounds";
		var value288;
		var _g289 = new haxe.ds.StringMap();
		var value289;
		var _g290 = new haxe.ds.StringMap();
		var value290;
		var _g291 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g291.setReserved("user_suffix","Assay Results"); else _g291.h["user_suffix"] = "Assay Results";
		if(__map_reserved["function"] != null) _g291.setReserved("function","saturn.core.domain.Compound.assaySearch"); else _g291.h["function"] = "saturn.core.domain.Compound.assaySearch";
		value290 = _g291;
		if(__map_reserved.assay_results != null) _g290.setReserved("assay_results",value290); else _g290.h["assay_results"] = value290;
		value289 = _g290;
		if(__map_reserved.search_bar != null) _g289.setReserved("search_bar",value289); else _g289.h["search_bar"] = value289;
		value288 = _g289;
		_g288.set("actions",value288);
		value287 = _g288;
		if(__map_reserved.options != null) _g283.setReserved("options",value287); else _g283.h["options"] = value287;
		var value291;
		var _g292 = new haxe.ds.StringMap();
		if(__map_reserved["Global ID"] != null) _g292.setReserved("Global ID","compoundId"); else _g292.h["Global ID"] = "compoundId";
		if(__map_reserved["Oxford ID"] != null) _g292.setReserved("Oxford ID","shortCompoundId"); else _g292.h["Oxford ID"] = "shortCompoundId";
		if(__map_reserved["Supplier ID"] != null) _g292.setReserved("Supplier ID","supplierId"); else _g292.h["Supplier ID"] = "supplierId";
		if(__map_reserved.Supplier != null) _g292.setReserved("Supplier","supplier"); else _g292.h["Supplier"] = "supplier";
		if(__map_reserved.Description != null) _g292.setReserved("Description","description"); else _g292.h["Description"] = "description";
		if(__map_reserved.Concentration != null) _g292.setReserved("Concentration","concentration"); else _g292.h["Concentration"] = "concentration";
		if(__map_reserved.Location != null) _g292.setReserved("Location","location"); else _g292.h["Location"] = "location";
		if(__map_reserved.Solute != null) _g292.setReserved("Solute","solute"); else _g292.h["Solute"] = "solute";
		if(__map_reserved.Comments != null) _g292.setReserved("Comments","comments"); else _g292.h["Comments"] = "comments";
		if(__map_reserved.MW != null) _g292.setReserved("MW","mw"); else _g292.h["MW"] = "mw";
		if(__map_reserved.Confidential != null) _g292.setReserved("Confidential","CONFIDENTIAL"); else _g292.h["Confidential"] = "CONFIDENTIAL";
		if(__map_reserved.Date != null) _g292.setReserved("Date","datestamp"); else _g292.h["Date"] = "datestamp";
		if(__map_reserved.Person != null) _g292.setReserved("Person","person"); else _g292.h["Person"] = "person";
		if(__map_reserved.InChi != null) _g292.setReserved("InChi","inchi"); else _g292.h["InChi"] = "inchi";
		if(__map_reserved.smiles != null) _g292.setReserved("smiles","smiles"); else _g292.h["smiles"] = "smiles";
		value291 = _g292;
		if(__map_reserved.model != null) _g283.setReserved("model",value291); else _g283.h["model"] = value291;
		var value292;
		var _g293 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.CompoundViewer"] != null) _g293.setReserved("saturn.client.programs.CompoundViewer",true); else _g293.h["saturn.client.programs.CompoundViewer"] = true;
		value292 = _g293;
		if(__map_reserved.programs != null) _g283.setReserved("programs",value292); else _g283.h["programs"] = value292;
		value282 = _g283;
		if(__map_reserved["saturn.core.domain.Compound"] != null) _g.setReserved("saturn.core.domain.Compound",value282); else _g.h["saturn.core.domain.Compound"] = value282;
		var value293;
		var _g294 = new haxe.ds.StringMap();
		var value294;
		var _g295 = new haxe.ds.StringMap();
		var value295;
		var _g296 = new haxe.ds.StringMap();
		if(__map_reserved.SGC != null) _g296.setReserved("SGC",true); else _g296.h["SGC"] = true;
		value295 = _g296;
		_g295.set("flags",value295);
		value294 = _g295;
		if(__map_reserved.options != null) _g294.setReserved("options",value294); else _g294.h["options"] = value294;
		value293 = _g294;
		if(__map_reserved["saturn.app.SaturnClient"] != null) _g.setReserved("saturn.app.SaturnClient",value293); else _g.h["saturn.app.SaturnClient"] = value293;
		var value296;
		var _g297 = new haxe.ds.StringMap();
		var value297;
		var _g298 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g298.setReserved("id","PKEY"); else _g298.h["id"] = "PKEY";
		if(__map_reserved.username != null) _g298.setReserved("username","USERID"); else _g298.h["username"] = "USERID";
		if(__map_reserved.fullname != null) _g298.setReserved("fullname","FULLNAME"); else _g298.h["fullname"] = "FULLNAME";
		value297 = _g298;
		if(__map_reserved.fields != null) _g297.setReserved("fields",value297); else _g297.h["fields"] = value297;
		var value298;
		var _g299 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g299.setReserved("id",true); else _g299.h["id"] = true;
		if(__map_reserved.username != null) _g299.setReserved("username",false); else _g299.h["username"] = false;
		value298 = _g299;
		if(__map_reserved.indexes != null) _g297.setReserved("indexes",value298); else _g297.h["indexes"] = value298;
		var value299;
		var _g300 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g300.setReserved("schema","HIVE"); else _g300.h["schema"] = "HIVE";
		if(__map_reserved.name != null) _g300.setReserved("name","USER_DETAILS"); else _g300.h["name"] = "USER_DETAILS";
		value299 = _g300;
		if(__map_reserved.table_info != null) _g297.setReserved("table_info",value299); else _g297.h["table_info"] = value299;
		value296 = _g297;
		if(__map_reserved["saturn.core.User"] != null) _g.setReserved("saturn.core.User",value296); else _g.h["saturn.core.User"] = value296;
		var value300;
		var _g301 = new haxe.ds.StringMap();
		var value301;
		var _g302 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g302.setReserved("id","PKEY"); else _g302.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g302.setReserved("name","NAME"); else _g302.h["name"] = "NAME";
		value301 = _g302;
		if(__map_reserved.fields != null) _g301.setReserved("fields",value301); else _g301.h["fields"] = value301;
		var value302;
		var _g303 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g303.setReserved("id",true); else _g303.h["id"] = true;
		if(__map_reserved.name != null) _g303.setReserved("name",false); else _g303.h["name"] = false;
		value302 = _g303;
		if(__map_reserved.index != null) _g301.setReserved("index",value302); else _g301.h["index"] = value302;
		var value303;
		var _g304 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g304.setReserved("schema","SGC"); else _g304.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g304.setReserved("name","SATURNPERMISSION"); else _g304.h["name"] = "SATURNPERMISSION";
		value303 = _g304;
		if(__map_reserved.table_info != null) _g301.setReserved("table_info",value303); else _g301.h["table_info"] = value303;
		value300 = _g301;
		if(__map_reserved["saturn.core.Permission"] != null) _g.setReserved("saturn.core.Permission",value300); else _g.h["saturn.core.Permission"] = value300;
		var value304;
		var _g305 = new haxe.ds.StringMap();
		var value305;
		var _g306 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g306.setReserved("id","PKEY"); else _g306.h["id"] = "PKEY";
		if(__map_reserved.permissionId != null) _g306.setReserved("permissionId","PERMISSIONID"); else _g306.h["permissionId"] = "PERMISSIONID";
		if(__map_reserved.userId != null) _g306.setReserved("userId","USERID"); else _g306.h["userId"] = "USERID";
		value305 = _g306;
		if(__map_reserved.fields != null) _g305.setReserved("fields",value305); else _g305.h["fields"] = value305;
		var value306;
		var _g307 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g307.setReserved("id",true); else _g307.h["id"] = true;
		value306 = _g307;
		if(__map_reserved.index != null) _g305.setReserved("index",value306); else _g305.h["index"] = value306;
		var value307;
		var _g308 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g308.setReserved("schema","SGC"); else _g308.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g308.setReserved("name","SATURNUSER_TO_PERMISSION"); else _g308.h["name"] = "SATURNUSER_TO_PERMISSION";
		value307 = _g308;
		if(__map_reserved.table_info != null) _g305.setReserved("table_info",value307); else _g305.h["table_info"] = value307;
		value304 = _g305;
		if(__map_reserved["saturn.core.UserToPermission"] != null) _g.setReserved("saturn.core.UserToPermission",value304); else _g.h["saturn.core.UserToPermission"] = value304;
		var value308;
		var _g309 = new haxe.ds.StringMap();
		var value309;
		var _g310 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g310.setReserved("id","PKEY"); else _g310.h["id"] = "PKEY";
		if(__map_reserved.userName != null) _g310.setReserved("userName","USERNAME"); else _g310.h["userName"] = "USERNAME";
		if(__map_reserved.isPublic != null) _g310.setReserved("isPublic","ISPUBLIC"); else _g310.h["isPublic"] = "ISPUBLIC";
		if(__map_reserved.sessionContent != null) _g310.setReserved("sessionContent","SESSIONCONTENTS"); else _g310.h["sessionContent"] = "SESSIONCONTENTS";
		if(__map_reserved.sessionName != null) _g310.setReserved("sessionName","SESSIONNAME"); else _g310.h["sessionName"] = "SESSIONNAME";
		value309 = _g310;
		if(__map_reserved.fields != null) _g309.setReserved("fields",value309); else _g309.h["fields"] = value309;
		var value310;
		var _g311 = new haxe.ds.StringMap();
		if(__map_reserved.sessionName != null) _g311.setReserved("sessionName",false); else _g311.h["sessionName"] = false;
		if(__map_reserved.id != null) _g311.setReserved("id",true); else _g311.h["id"] = true;
		value310 = _g311;
		if(__map_reserved.indexes != null) _g309.setReserved("indexes",value310); else _g309.h["indexes"] = value310;
		var value311;
		var _g312 = new haxe.ds.StringMap();
		if(__map_reserved["user.fullname"] != null) _g312.setReserved("user.fullname",null); else _g312.h["user.fullname"] = null;
		value311 = _g312;
		if(__map_reserved.search != null) _g309.setReserved("search",value311); else _g309.h["search"] = value311;
		var value312;
		var _g313 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g313.setReserved("schema","SGC"); else _g313.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g313.setReserved("name","SATURNSESSION"); else _g313.h["name"] = "SATURNSESSION";
		value312 = _g313;
		if(__map_reserved.table_info != null) _g309.setReserved("table_info",value312); else _g309.h["table_info"] = value312;
		var value313;
		var _g314 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g314.setReserved("alias","Session"); else _g314.h["alias"] = "Session";
		if(__map_reserved.auto_activate != null) _g314.setReserved("auto_activate","3"); else _g314.h["auto_activate"] = "3";
		var value314;
		var _g315 = new haxe.ds.StringMap();
		if(__map_reserved.user_constraint_field != null) _g315.setReserved("user_constraint_field","userName"); else _g315.h["user_constraint_field"] = "userName";
		if(__map_reserved.public_constraint_field != null) _g315.setReserved("public_constraint_field","isPublic"); else _g315.h["public_constraint_field"] = "isPublic";
		value314 = _g315;
		_g314.set("constraints",value314);
		var value315;
		var _g316 = new haxe.ds.StringMap();
		var value316;
		var _g317 = new haxe.ds.StringMap();
		var value317;
		var _g318 = new haxe.ds.StringMap();
		if(__map_reserved.user_suffix != null) _g318.setReserved("user_suffix",""); else _g318.h["user_suffix"] = "";
		if(__map_reserved["function"] != null) _g318.setReserved("function","saturn.core.domain.SaturnSession.load"); else _g318.h["function"] = "saturn.core.domain.SaturnSession.load";
		value317 = _g318;
		if(__map_reserved.DEFAULT != null) _g317.setReserved("DEFAULT",value317); else _g317.h["DEFAULT"] = value317;
		value316 = _g317;
		if(__map_reserved.search_bar != null) _g316.setReserved("search_bar",value316); else _g316.h["search_bar"] = value316;
		value315 = _g316;
		_g314.set("actions",value315);
		value313 = _g314;
		if(__map_reserved.options != null) _g309.setReserved("options",value313); else _g309.h["options"] = value313;
		var value318;
		var _g319 = new haxe.ds.StringMap();
		if(__map_reserved.USERNAME != null) _g319.setReserved("USERNAME","insert.username"); else _g319.h["USERNAME"] = "insert.username";
		value318 = _g319;
		if(__map_reserved.auto_functions != null) _g309.setReserved("auto_functions",value318); else _g309.h["auto_functions"] = value318;
		var value319;
		var _g320 = new haxe.ds.StringMap();
		var value320;
		var _g321 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g321.setReserved("field","userName"); else _g321.h["field"] = "userName";
		if(__map_reserved["class"] != null) _g321.setReserved("class","saturn.core.User"); else _g321.h["class"] = "saturn.core.User";
		if(__map_reserved.fk_field != null) _g321.setReserved("fk_field","username"); else _g321.h["fk_field"] = "username";
		value320 = _g321;
		_g320.set("user",value320);
		value319 = _g320;
		if(__map_reserved["fields.synthetic"] != null) _g309.setReserved("fields.synthetic",value319); else _g309.h["fields.synthetic"] = value319;
		value308 = _g309;
		if(__map_reserved["saturn.core.domain.SaturnSession"] != null) _g.setReserved("saturn.core.domain.SaturnSession",value308); else _g.h["saturn.core.domain.SaturnSession"] = value308;
		var value321;
		var _g322 = new haxe.ds.StringMap();
		var value322;
		var _g323 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g323.setReserved("id","PKEY"); else _g323.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g323.setReserved("name","NAME"); else _g323.h["name"] = "NAME";
		if(__map_reserved.traceDataJson != null) _g323.setReserved("traceDataJson","TRACE_JSON"); else _g323.h["traceDataJson"] = "TRACE_JSON";
		value322 = _g323;
		if(__map_reserved.fields != null) _g322.setReserved("fields",value322); else _g322.h["fields"] = value322;
		var value323;
		var _g324 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g324.setReserved("name",false); else _g324.h["name"] = false;
		if(__map_reserved.id != null) _g324.setReserved("id",true); else _g324.h["id"] = true;
		value323 = _g324;
		if(__map_reserved.indexes != null) _g322.setReserved("indexes",value323); else _g322.h["indexes"] = value323;
		var value324;
		var _g325 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ABITraceViewer"] != null) _g325.setReserved("saturn.client.programs.ABITraceViewer",true); else _g325.h["saturn.client.programs.ABITraceViewer"] = true;
		value324 = _g325;
		if(__map_reserved.programs != null) _g322.setReserved("programs",value324); else _g322.h["programs"] = value324;
		var value325;
		var _g326 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g326.setReserved("alias","Trace Data"); else _g326.h["alias"] = "Trace Data";
		if(__map_reserved.icon != null) _g326.setReserved("icon","dna_conical_16.png"); else _g326.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.workspace_wrapper != null) _g326.setReserved("workspace_wrapper","saturn.client.workspace.ABITraceWO"); else _g326.h["workspace_wrapper"] = "saturn.client.workspace.ABITraceWO";
		value325 = _g326;
		if(__map_reserved.options != null) _g322.setReserved("options",value325); else _g322.h["options"] = value325;
		var value326;
		var _g327 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g327.setReserved("schema","SGC"); else _g327.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g327.setReserved("name","TRACES"); else _g327.h["name"] = "TRACES";
		value326 = _g327;
		if(__map_reserved.table_info != null) _g322.setReserved("table_info",value326); else _g322.h["table_info"] = value326;
		var value327;
		var _g328 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g328.setReserved("name",true); else _g328.h["name"] = true;
		value327 = _g328;
		if(__map_reserved.search != null) _g322.setReserved("search",value327); else _g322.h["search"] = value327;
		value321 = _g322;
		if(__map_reserved["saturn.core.domain.ABITrace"] != null) _g.setReserved("saturn.core.domain.ABITrace",value321); else _g.h["saturn.core.domain.ABITrace"] = value321;
		var value328;
		var _g329 = new haxe.ds.StringMap();
		var value329;
		var _g330 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g330.setReserved("id","PKEY"); else _g330.h["id"] = "PKEY";
		if(__map_reserved.name != null) _g330.setReserved("name","NAME"); else _g330.h["name"] = "NAME";
		if(__map_reserved.content != null) _g330.setReserved("content","CONTENT"); else _g330.h["content"] = "CONTENT";
		if(__map_reserved.url != null) _g330.setReserved("url","URL"); else _g330.h["url"] = "URL";
		value329 = _g330;
		if(__map_reserved.fields != null) _g329.setReserved("fields",value329); else _g329.h["fields"] = value329;
		var value330;
		var _g331 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g331.setReserved("name",false); else _g331.h["name"] = false;
		if(__map_reserved.id != null) _g331.setReserved("id",true); else _g331.h["id"] = true;
		value330 = _g331;
		if(__map_reserved.indexes != null) _g329.setReserved("indexes",value330); else _g329.h["indexes"] = value330;
		var value331;
		var _g332 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.AlignmentViewer"] != null) _g332.setReserved("saturn.client.programs.AlignmentViewer",true); else _g332.h["saturn.client.programs.AlignmentViewer"] = true;
		value331 = _g332;
		if(__map_reserved.programs != null) _g329.setReserved("programs",value331); else _g329.h["programs"] = value331;
		var value332;
		var _g333 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g333.setReserved("alias","Alignments"); else _g333.h["alias"] = "Alignments";
		if(__map_reserved.icon != null) _g333.setReserved("icon","dna_conical_16.png"); else _g333.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.workspace_wrapper != null) _g333.setReserved("workspace_wrapper","saturn.client.workspace.AlignmentWorkspaceObject"); else _g333.h["workspace_wrapper"] = "saturn.client.workspace.AlignmentWorkspaceObject";
		value332 = _g333;
		if(__map_reserved.options != null) _g329.setReserved("options",value332); else _g329.h["options"] = value332;
		var value333;
		var _g334 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g334.setReserved("schema","SGC"); else _g334.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g334.setReserved("name","ALIGNMENTS"); else _g334.h["name"] = "ALIGNMENTS";
		value333 = _g334;
		if(__map_reserved.table_info != null) _g329.setReserved("table_info",value333); else _g329.h["table_info"] = value333;
		var value334;
		var _g335 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g335.setReserved("name",true); else _g335.h["name"] = true;
		value334 = _g335;
		if(__map_reserved.search != null) _g329.setReserved("search",value334); else _g329.h["search"] = value334;
		value328 = _g329;
		if(__map_reserved["saturn.core.domain.Alignment"] != null) _g.setReserved("saturn.core.domain.Alignment",value328); else _g.h["saturn.core.domain.Alignment"] = value328;
		this.models = _g;
	}
	,__class__: saturn.db.mapping.SGC
};
saturn.db.mapping.SGCSQLite = $hxClasses["saturn.db.mapping.SGCSQLite"] = function() {
	saturn.db.mapping.SGC.call(this);
	saturn.core.Util.debug("Loading SQLite");
};
saturn.db.mapping.SGCSQLite.__name__ = ["saturn","db","mapping","SGCSQLite"];
saturn.db.mapping.SGCSQLite.__super__ = saturn.db.mapping.SGC;
saturn.db.mapping.SGCSQLite.prototype = $extend(saturn.db.mapping.SGC.prototype,{
	buildModels: function() {
		saturn.db.mapping.SGC.prototype.buildModels.call(this);
		saturn.core.Util.debug("Adding flag");
		((function($this) {
			var $r;
			var this1;
			{
				var this2 = $this.models.get("saturn.app.SaturnClient");
				this1 = this2.get("options");
			}
			$r = this1.get("flags");
			return $r;
		}(this))).set("NO_LOGIN",true);
		var value;
		var _g = new haxe.ds.StringMap();
		var value1;
		var _g1 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g1.setReserved("targetId","TARGET_ID"); else _g1.h["targetId"] = "TARGET_ID";
		if(__map_reserved.id != null) _g1.setReserved("id","PKEY"); else _g1.h["id"] = "PKEY";
		if(__map_reserved.gi != null) _g1.setReserved("gi","GENBANK_ID"); else _g1.h["gi"] = "GENBANK_ID";
		if(__map_reserved.dnaSeq != null) _g1.setReserved("dnaSeq","DNASEQ"); else _g1.h["dnaSeq"] = "DNASEQ";
		if(__map_reserved.proteinSeq != null) _g1.setReserved("proteinSeq","PROTSEQ"); else _g1.h["proteinSeq"] = "PROTSEQ";
		value1 = _g1;
		if(__map_reserved.fields != null) _g.setReserved("fields",value1); else _g.h["fields"] = value1;
		var value2;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g2.setReserved("targetId",false); else _g2.h["targetId"] = false;
		if(__map_reserved.id != null) _g2.setReserved("id",true); else _g2.h["id"] = true;
		value2 = _g2;
		if(__map_reserved.indexes != null) _g.setReserved("indexes",value2); else _g.h["indexes"] = value2;
		var value3;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g3.setReserved("schema","SGC"); else _g3.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g3.setReserved("name","TARGET"); else _g3.h["name"] = "TARGET";
		if(__map_reserved.human_name != null) _g3.setReserved("human_name","Target"); else _g3.h["human_name"] = "Target";
		if(__map_reserved.human_name_plural != null) _g3.setReserved("human_name_plural","Targets"); else _g3.h["human_name_plural"] = "Targets";
		value3 = _g3;
		if(__map_reserved.table_info != null) _g.setReserved("table_info",value3); else _g.h["table_info"] = value3;
		var value4;
		var _g4 = new haxe.ds.StringMap();
		if(__map_reserved["Target ID"] != null) _g4.setReserved("Target ID","targetId"); else _g4.h["Target ID"] = "targetId";
		if(__map_reserved["Genbank ID"] != null) _g4.setReserved("Genbank ID","gi"); else _g4.h["Genbank ID"] = "gi";
		if(__map_reserved["Protein Sequence"] != null) _g4.setReserved("Protein Sequence","proteinSeq"); else _g4.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g4.setReserved("__HIDDEN__PKEY__","id"); else _g4.h["__HIDDEN__PKEY__"] = "id";
		value4 = _g4;
		if(__map_reserved.model != null) _g.setReserved("model",value4); else _g.h["model"] = value4;
		var value5;
		var _g5 = new haxe.ds.StringMap();
		var value6;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g6.setReserved("field","proteinSeq"); else _g6.h["field"] = "proteinSeq";
		if(__map_reserved["class"] != null) _g6.setReserved("class","saturn.core.Protein"); else _g6.h["class"] = "saturn.core.Protein";
		if(__map_reserved.fk_field != null) _g6.setReserved("fk_field",null); else _g6.h["fk_field"] = null;
		value6 = _g6;
		_g5.set("proteinSequenceObj",value6);
		value5 = _g5;
		if(__map_reserved["fields.synthetic"] != null) _g.setReserved("fields.synthetic",value5); else _g.h["fields.synthetic"] = value5;
		var value7;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g7.setReserved("targetId",null); else _g7.h["targetId"] = null;
		value7 = _g7;
		if(__map_reserved.search != null) _g.setReserved("search",value7); else _g.h["search"] = value7;
		var value8;
		var _g8 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g8.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g8.h["saturn.client.programs.DNASequenceEditor"] = true;
		value8 = _g8;
		if(__map_reserved.programs != null) _g.setReserved("programs",value8); else _g.h["programs"] = value8;
		var value9;
		var _g9 = new haxe.ds.StringMap();
		if(__map_reserved.id_pattern != null) _g9.setReserved("id_pattern",".*"); else _g9.h["id_pattern"] = ".*";
		if(__map_reserved.alias != null) _g9.setReserved("alias","Target"); else _g9.h["alias"] = "Target";
		if(__map_reserved["file.new.label"] != null) _g9.setReserved("file.new.label","Target"); else _g9.h["file.new.label"] = "Target";
		if(__map_reserved.icon != null) _g9.setReserved("icon","dna_conical_16.png"); else _g9.h["icon"] = "dna_conical_16.png";
		if(__map_reserved.auto_activate != null) _g9.setReserved("auto_activate","3"); else _g9.h["auto_activate"] = "3";
		value9 = _g9;
		if(__map_reserved.options != null) _g.setReserved("options",value9); else _g.h["options"] = value9;
		value = _g;
		this.models.set("saturn.core.domain.SgcTarget",value);
	}
	,__class__: saturn.db.mapping.SGCSQLite
});
saturn.db.mapping.SQLiteMapping = $hxClasses["saturn.db.mapping.SQLiteMapping"] = function() { };
saturn.db.mapping.SQLiteMapping.__name__ = ["saturn","db","mapping","SQLiteMapping"];
if(!saturn.db.mapping.templates) saturn.db.mapping.templates = {};
saturn.db.mapping.templates.DefaultMapping = $hxClasses["saturn.db.mapping.templates.DefaultMapping"] = function() {
	this.buildModels();
};
saturn.db.mapping.templates.DefaultMapping.__name__ = ["saturn","db","mapping","templates","DefaultMapping"];
saturn.db.mapping.templates.DefaultMapping.prototype = {
	models: null
	,buildModels: function() {
		this.models = new haxe.ds.StringMap();
	}
	,__class__: saturn.db.mapping.templates.DefaultMapping
};
if(!saturn.db.provider) saturn.db.provider = {};
saturn.db.provider.GenericRDBMSProvider = $hxClasses["saturn.db.provider.GenericRDBMSProvider"] = function(models,config,autoClose) {
	this.modelsToProcess = 0;
	this.theConnection = null;
	this.debug = (js.Node.require("debug"))("saturn:sql");
	saturn.db.DefaultProvider.call(this,models,config,autoClose);
	this.config = config;
	this.user = new saturn.core.User();
	this.user.username = config.username;
	this.user.password = config.password;
	var $it0 = this.namedQueryHooks.keys();
	while( $it0.hasNext() ) {
		var hook = $it0.next();
		this.debug("Installed hook: " + hook + "/" + Std.string(this.namedQueryHooks.get(hook)));
	}
	this.debug("Platform: " + js.Node.process.platform);
	this.debug("Platform key: " + this.platform);
};
saturn.db.provider.GenericRDBMSProvider.__name__ = ["saturn","db","provider","GenericRDBMSProvider"];
saturn.db.provider.GenericRDBMSProvider.__super__ = saturn.db.DefaultProvider;
saturn.db.provider.GenericRDBMSProvider.prototype = $extend(saturn.db.DefaultProvider.prototype,{
	debug: null
	,theConnection: null
	,modelsToProcess: null
	,setPlatform: function() {
		if(js.Node.process.platform == "win32") this.platform = "windows"; else this.platform = js.Node.process.platform;
	}
	,setUser: function(user) {
		this.debug("User called");
		saturn.db.DefaultProvider.prototype.setUser.call(this,user);
	}
	,generatedLinkedClone: function() {
		var provider = saturn.db.DefaultProvider.prototype.generatedLinkedClone.call(this);
		provider.config = this.config;
		provider.debug = this.debug;
		provider.modelsToProcess = this.modelsToProcess;
		provider.theConnection = null;
		provider.user = this.user;
		return provider;
	}
	,readModels: function(cb) {
		var _g = this;
		var modelClazzes = [];
		var $it0 = this.theBindingMap.keys();
		while( $it0.hasNext() ) {
			var modelClazz = $it0.next();
			modelClazzes.push(modelClazz);
		}
		this.modelsToProcess = modelClazzes.length;
		this.getConnection(this.config,function(err,conn) {
			if(err != null) {
				_g.debug("Error getting connection for reading models");
				_g.debug(err);
				cb(err);
			} else {
				_g.debug("Querying database for model information");
				_g._readModels(modelClazzes,_g,conn,cb);
			}
		});
	}
	,_readModels: function(modelClazzes,provider,connection,cb) {
		var _g = this;
		var modelClazz = modelClazzes.pop();
		this.debug("Processing model: " + modelClazz);
		var model = provider.getModelByStringName(modelClazz);
		var captured_super = $bind(this,this.postConfigureModels);
		if(model.hasTableInfo()) {
			var keyCol = model.getFirstKey_rdbms();
			var priCol = model.getPrimaryKey_rdbms();
			var tableName = model.getTableName();
			var schemaName = model.getSchemaName();
			var qName = this.generateQualifiedName(schemaName,tableName);
			var func = function(err,cols) {
				if(err != null) cb(err); else {
					provider.setSelectClause(modelClazz,"SELECT DISTINCT " + cols.join(",") + " FROM " + qName);
					model.setInsertClause("INSERT INTO " + qName);
					model.setDeleteClause("DELETE FROM " + qName + "WHERE " + priCol + " = " + _g.dbSpecificParamPlaceholder(1));
					model.setUpdateClause("UPDATE " + qName);
					model.setSelectKeyClause("SELECT DISTINCT " + keyCol + ", " + priCol + " FROM " + qName + " ");
					model.setColumns(cols);
					_g.modelsToProcess--;
					_g.debug("Model processed: " + modelClazz);
					_g.debug(cols);
					if(_g.modelsToProcess == 0) {
						_g.postConfigureModels();
						_g.closeConnection(connection);
						if(cb != null) {
							_g.debug("All Models have been processed (handing back control to caller callback)");
							cb(null);
						}
					} else _g._readModels(modelClazzes,provider,connection,cb);
				}
			};
			this.getColumns(connection,schemaName,tableName,func);
		} else if(modelClazzes.length == 0 && this.modelsToProcess == 1) {
			this.closeConnection(connection);
			if(cb != null) {
				this.debug("All Models have been processed (handing back control to caller callback)");
				cb(null);
			}
		} else {
			this.modelsToProcess--;
			this._readModels(modelClazzes,provider,connection,cb);
		}
	}
	,generateQualifiedName: function(schemaName,tableName) {
		return schemaName + "." + tableName;
	}
	,getColumns: function(connection,schemaName,tableName,cb) {
		connection.execute("select COLUMN_NAME from ALL_TAB_COLUMNS where OWNER=:1 AND TABLE_NAME=:2",[schemaName,tableName],function(err,results) {
			if(err == null) {
				var cols = [];
				var _g = 0;
				while(_g < results.length) {
					var row = results[_g];
					++_g;
					cols.push(Reflect.field(row,"COLUMN_NAME"));
				}
				cb(null,cols);
			} else cb(err,null);
		});
	}
	,_closeConnection: function() {
		this.debug("Closing connection!");
		if(this.theConnection != null) {
			this.theConnection.close();
			this.theConnection = null;
		}
	}
	,getConnection: function(config,cb) {
		var _g = this;
		if(!this.autoClose && this.theConnection != null) {
			this.debug("Using existing connection");
			cb(null,this.theConnection);
			return;
		}
		this._getConnection(function(err,conn) {
			_g.theConnection = conn;
			cb(err,conn);
		});
	}
	,_getConnection: function(cb) {
	}
	,_getByIds: function(ids,clazz,callBack) {
		var _g = this;
		if(clazz == saturn.core.domain.FileProxy) {
			this.handleFileRequests(ids,clazz,callBack);
			return;
		}
		var model = this.getModel(clazz);
		var selectClause = model.getSelectClause();
		var keyCol = model.getFirstKey_rdbms();
		var _g1 = 0;
		var _g2 = ids.length;
		while(_g1 < _g2) {
			var i = _g1++;
			ids[i] = ids[i].toUpperCase();
		}
		var selectorSQL = this.getSelectorFieldConstraintSQL(clazz);
		if(selectorSQL != "") selectorSQL = " AND " + selectorSQL;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) callBack(null,err); else {
				var sql = selectClause + "  WHERE UPPER(" + _g.columnToStringCommand(keyCol) + ") " + _g.buildSqlInClause(ids.length) + " " + selectorSQL;
				var additionalSQL = _g.generateUserConstraintSQL(clazz);
				if(additionalSQL != null) sql += " AND " + additionalSQL;
				sql += " ORDER BY " + keyCol;
				_g.debug("SQL" + sql);
				try {
					connection.execute(sql,ids,function(err1,results) {
						if(err1 != null) callBack(null,err1); else {
							_g.debug("Sending results");
							callBack(results,null);
						}
						_g.closeConnection(connection);
					});
				} catch( e ) {
					if (e instanceof js._Boot.HaxeError) e = e.val;
					_g.closeConnection(connection);
					saturn.core.Util.debug(e);
					callBack(null,e);
				}
			}
		});
	}
	,_getObjects: function(clazz,callBack) {
		var _g = this;
		var model = this.getModel(clazz);
		var selectClause = model.getSelectClause();
		var selectorSQL = this.getSelectorFieldConstraintSQL(clazz);
		if(selectorSQL != "") selectorSQL = " WHERE " + selectorSQL;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) callBack(null,err); else {
				var sql = selectClause + " " + selectorSQL;
				var additionalSQL = _g.generateUserConstraintSQL(clazz);
				if(additionalSQL != null) sql += " AND " + additionalSQL;
				sql += " ORDER BY " + model.getFirstKey_rdbms();
				_g.debug(sql);
				try {
					connection.execute(sql,[],function(err1,results) {
						if(err1 != null) callBack(null,err1); else callBack(results,null);
						_g.closeConnection(connection);
					});
				} catch( e ) {
					if (e instanceof js._Boot.HaxeError) e = e.val;
					_g.closeConnection(connection);
					saturn.core.Util.debug(e);
					callBack(null,e);
				}
			}
		});
	}
	,_getByValues: function(values,clazz,field,callBack) {
		var _g = this;
		if(clazz == saturn.core.domain.FileProxy) {
			this.handleFileRequests(values,clazz,callBack);
			return;
		}
		var model = this.getModel(clazz);
		var selectClause = model.getSelectClause();
		var sqlField = model.getSqlColumn(field);
		var selectorSQL = this.getSelectorFieldConstraintSQL(clazz);
		if(selectorSQL != "") selectorSQL = " AND " + selectorSQL;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) callBack(null,err); else {
				var sql = selectClause + "  WHERE " + sqlField + " " + _g.buildSqlInClause(values.length) + " " + selectorSQL;
				var additionalSQL = _g.generateUserConstraintSQL(clazz);
				if(additionalSQL != null) sql += " AND " + additionalSQL;
				sql += " ORDER BY " + sqlField;
				_g.debug(sql);
				_g.debug(values);
				try {
					connection.execute(sql,values,function(err1,results) {
						if(err1 != null) callBack(null,err1); else {
							_g.debug("Result count: " + Std.string(results) + " " + Std.string(values));
							callBack(results,null);
						}
						_g.closeConnection(connection);
					});
				} catch( e ) {
					if (e instanceof js._Boot.HaxeError) e = e.val;
					_g.closeConnection(connection);
					saturn.core.Util.debug(e);
					callBack(null,e);
				}
			}
		});
	}
	,getSelectorFieldConstraintSQL: function(clazz) {
		var model = this.getModel(clazz);
		var selectorField = model.getSelectorField();
		if(selectorField != null) {
			var selectorValue = model.getSelectorValue();
			return selectorField + " = \"" + selectorValue + "\"";
		} else return "";
	}
	,buildSqlInClause: function(numIds,nextVal,func) {
		if(nextVal == null) nextVal = 0;
		var inClause_b = "";
		inClause_b += "IN(";
		var _g = 0;
		while(_g < numIds) {
			var i = _g++;
			var def = this.dbSpecificParamPlaceholder(i + 1 + nextVal);
			if(func != null) def = func + "(" + def + ")";
			if(def == null) inClause_b += "null"; else inClause_b += "" + def;
			if(i != numIds - 1) inClause_b += ",";
		}
		inClause_b += ")";
		return inClause_b;
	}
	,_getByPkeys: function(ids,clazz,callBack) {
		var _g = this;
		if(clazz == saturn.core.domain.FileProxy) {
			this.handleFileRequests(ids,clazz,callBack);
			return;
		}
		var model = this.getModel(clazz);
		var selectClause = model.getSelectClause();
		var keyCol = model.getPrimaryKey_rdbms();
		var selectorSQL = this.getSelectorFieldConstraintSQL(clazz);
		if(selectorSQL != "") selectorSQL = " AND " + selectorSQL;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) callBack(null,err); else {
				var sql = selectClause + "  WHERE " + keyCol + " " + _g.buildSqlInClause(ids.length) + selectorSQL;
				var additionalSQL = _g.generateUserConstraintSQL(clazz);
				if(additionalSQL != null) sql += " AND " + additionalSQL;
				sql += " " + " ORDER BY " + keyCol;
				_g.debug(sql);
				try {
					connection.execute(sql,ids,function(err1,results) {
						if(err1 != null) callBack(null,err1); else callBack(results,null);
						_g.closeConnection(connection);
					});
				} catch( e ) {
					if (e instanceof js._Boot.HaxeError) e = e.val;
					_g.closeConnection(connection);
					callBack(null,e);
				}
			}
		});
	}
	,_query: function(query,cb) {
		var _g = this;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) cb(null,err); else try {
				var visitor = new saturn.db.query_lang.SQLVisitor(_g);
				var sql = visitor.translate(query);
				_g.debug(sql);
				_g.debug(visitor.getValues());
				connection.execute(sql,visitor.getValues(),function(err1,results) {
					if(err1 != null) cb(null,err1); else {
						results = visitor.getProcessedResults(results);
						cb(results,null);
					}
					_g.closeConnection(connection);
				});
			} catch( e ) {
				if (e instanceof js._Boot.HaxeError) e = e.val;
				_g.closeConnection(connection);
				_g.debug("Error !!!!!!!!!!!!!" + Std.string(e.stack));
				cb(null,e);
			}
		});
	}
	,_getByIdStartsWith: function(id,field,clazz,limit,callBack) {
		var _g = this;
		var model = this.getModel(clazz);
		this.debug("Provider class" + Type.getClassName(js.Boot.getClass(this)));
		this.debug("Provider: " + model.getProviderName());
		var keyCol = null;
		if(field == null) keyCol = model.getFirstKey_rdbms(); else if(model.isRDBMSField(field)) keyCol = field;
		var busKey = model.getFirstKey_rdbms();
		var priCol = model.getPrimaryKey_rdbms();
		var tableName = model.getTableName();
		var schemaName = model.getSchemaName();
		var qName = this.generateQualifiedName(schemaName,tableName);
		var selectClause = "SELECT DISTINCT " + busKey + ", " + priCol;
		if(keyCol != busKey && keyCol != priCol) selectClause += ", " + keyCol;
		selectClause += " FROM " + qName;
		id = id.toUpperCase();
		var selectorSQL = this.getSelectorFieldConstraintSQL(clazz);
		if(selectorSQL != "") selectorSQL = " AND " + selectorSQL;
		if(!this.limitAtEndPosition()) {
			if(limit != null && limit != 0 && limit != -1) selectorSQL += this.generateLimitClause(limit);
		}
		this.getConnection(this.config,function(err,connection) {
			if(err != null) callBack(null,err); else {
				var sql = selectClause + "  WHERE UPPER(" + _g.columnToStringCommand(keyCol) + ") like " + _g.dbSpecificParamPlaceholder(1) + " " + selectorSQL;
				var additionalSQL = _g.generateUserConstraintSQL(clazz);
				if(additionalSQL != null) sql += " AND " + additionalSQL;
				sql += " ORDER BY " + keyCol;
				if(_g.limitAtEndPosition()) {
					if(limit != null && limit != 0 && limit != -1) sql += _g.generateLimitClause(limit);
				}
				id = "%" + id + "%";
				_g.debug("startswith" + sql);
				try {
					connection.execute(sql,[id],function(err1,results) {
						_g.debug("startswith" + err1);
						if(err1 != null) callBack(null,err1); else callBack(results,null);
						_g.closeConnection(connection);
					});
				} catch( e ) {
					if (e instanceof js._Boot.HaxeError) e = e.val;
					saturn.core.Util.debug(e);
					_g.closeConnection(connection);
					callBack(null,e);
				}
			}
		});
	}
	,limitAtEndPosition: function() {
		return false;
	}
	,generateLimitClause: function(limit) {
		return " AND ROWNUM < " + (limit | 0);
	}
	,columnToStringCommand: function(columnName) {
		return columnName;
	}
	,convertComplexQuery: function(parameters) {
	}
	,_getByNamedQuery: function(queryId,parameters,clazz,cb) {
		var _g = this;
		if(!Object.prototype.hasOwnProperty.call(this.config.named_queries,queryId)) cb(null,"Query " + queryId + " not found "); else {
			var sql = Reflect.field(this.config.named_queries,queryId);
			var realParameters = [];
			if((parameters instanceof Array) && parameters.__enum__ == null) {
				this.debug("Named query passed an Array");
				var re = new EReg("(<IN>)","");
				if(re.match(sql)) sql = re.replace(sql,this.buildSqlInClause(parameters.length));
				realParameters = parameters;
			} else {
				this.debug("Named query with other object type");
				var dbPlaceHolderI = 0;
				var attributes = Reflect.fields(parameters);
				if(attributes.length == 0) {
					cb(null,"Unknown parameter collection type");
					return;
				} else {
					this.debug("Named query passed object");
					var re_in = new EReg("^IN:","");
					var re1 = new EReg("<:([^>]+)>","");
					var convertedSQL = "";
					var matchMe = sql;
					while(matchMe != null) {
						this.debug("Looping: " + matchMe);
						this.debug("SQL: " + convertedSQL);
						if(re1.matchSub(matchMe,0)) {
							var matchLeft = re1.matchedLeft();
							var tagName = re1.matched(1);
							this.debug("MatchLeft: " + matchLeft);
							this.debug("Tag:" + tagName);
							convertedSQL += matchLeft;
							if(re_in.matchSub(tagName,0)) {
								this.debug("Found IN");
								tagName = re_in.replace(tagName,"");
								this.debug("Real Tag Name" + tagName);
								if(Object.prototype.hasOwnProperty.call(parameters,tagName)) {
									this.debug("Found array");
									var paramArray = Reflect.field(parameters,tagName);
									if((paramArray instanceof Array) && paramArray.__enum__ == null) {
										convertedSQL += this.buildSqlInClause(paramArray.length);
										var _g1 = 0;
										var _g2 = paramArray.length;
										while(_g1 < _g2) {
											var i = _g1++;
											realParameters.push(paramArray[i]);
										}
									} else {
										cb(null,"Value to attribute " + tagName + " should be an Array");
										return;
									}
								} else {
									cb(null,"Missing attribute " + tagName);
									return;
								}
							} else {
								this.debug("Found non IN argument");
								if(Object.prototype.hasOwnProperty.call(parameters,tagName)) {
									convertedSQL += this.dbSpecificParamPlaceholder(dbPlaceHolderI++);
									var value = Reflect.field(parameters,tagName);
									realParameters.push(value);
								} else {
									cb(null,"Missing attribute " + tagName);
									return;
								}
							}
							matchMe = re1.matchedRight();
							this.debug("Found right " + matchMe);
						} else {
							convertedSQL += matchMe;
							matchMe = null;
							this.debug("Terminating while");
						}
					}
					sql = convertedSQL;
				}
			}
			this.debug("SQL: " + sql);
			this.debug("Parameters: " + Std.string(realParameters));
			this.getConnection(this.config,function(err,connection) {
				if(err != null) cb(null,err); else {
					_g.debug(sql);
					try {
						connection.execute(sql,realParameters,function(err1,results) {
							_g.debug("Named query returning");
							if(err1 != null) cb(null,err1); else cb(results,null);
							_g.closeConnection(connection);
						});
					} catch( e ) {
						if (e instanceof js._Boot.HaxeError) e = e.val;
						_g.closeConnection(connection);
						cb(null,e);
					}
				}
			});
		}
	}
	,_update: function(attributeMaps,className,cb) {
		var _g = this;
		this.applyFunctions(attributeMaps,className);
		this.getConnection(this.config,function(err,connection) {
			if(err != null) cb(err); else {
				var clazz = Type.resolveClass(className);
				var model = _g.getModel(clazz);
				_g._updateRecursive(attributeMaps,model,cb,connection);
			}
		});
	}
	,_insert: function(attributeMaps,className,cb) {
		var _g = this;
		this.applyFunctions(attributeMaps,className);
		this.getConnection(this.config,function(err,connection) {
			if(err != null) cb(err); else {
				var clazz = Type.resolveClass(className);
				var model = _g.getModel(clazz);
				_g._insertRecursive(attributeMaps,model,cb,connection);
			}
		});
	}
	,cloneConfig: function() {
		var cloneData = haxe.Serializer.run(this.config);
		var unserObj = haxe.Unserializer.run(cloneData);
		return unserObj;
	}
	,_insertRecursive: function(attributeMaps,model,cb,connection) {
		var _g = this;
		this.debug("Inserting  " + Type.getClassName(model.getClass()));
		var insertClause = model.getInsertClause();
		var cols = model.getColumnSet();
		var attributeMap = attributeMaps.pop();
		var colStr = new StringBuf();
		var valList = [];
		var valStr = new StringBuf();
		var i = 0;
		var hasWork = false;
		var $it0 = attributeMap.keys();
		while( $it0.hasNext() ) {
			var attribute = $it0.next();
			if(cols != null && (__map_reserved[attribute] != null?cols.existsReserved(attribute):cols.h.hasOwnProperty(attribute))) {
				if(i > 0) {
					colStr.b += ",";
					valStr.b += ",";
				}
				i++;
				if(attribute == null) colStr.b += "null"; else colStr.b += "" + attribute;
				valStr.add(this.dbSpecificParamPlaceholder(i));
				var val;
				val = __map_reserved[attribute] != null?attributeMap.getReserved(attribute):attributeMap.h[attribute];
				if(val == "" && !((val | 0) === val)) val = null;
				valList.push(val);
				hasWork = true;
			}
		}
		if(model.isPolymorph()) {
			i++;
			colStr.add("," + model.getSelectorField());
			valStr.add("," + this.dbSpecificParamPlaceholder(i));
			valList.push(model.getSelectorValue());
			hasWork = true;
		}
		if(!hasWork) {
			this.debug("No work - returning error");
			cb("Insert failure: no mapped fields for " + Type.getClassName(model.getClass()));
			return;
		}
		var sql = insertClause + " (" + Std.string(colStr) + ") VALUES(" + Std.string(valStr) + ")";
		var keyCol = model.getFirstKey_rdbms();
		var keyVal;
		keyVal = __map_reserved[keyCol] != null?attributeMap.getReserved(keyCol):attributeMap.h[keyCol];
		this.debug("MAP:" + attributeMap.toString());
		this.debug("SQL" + sql);
		this.debug("Values" + Std.string(valList));
		try {
			connection.execute(sql,valList,function(err,results) {
				if(err != null) {
					var error = { message : StringTools.replace(err == null?"null":"" + err,"\n",""), source : keyVal};
					cb(error);
					_g.closeConnection(connection);
				} else if(attributeMaps.length == 0) {
					cb(null);
					_g.closeConnection(connection);
				} else _g._insertRecursive(attributeMaps,model,cb,connection);
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			this.closeConnection(connection);
			var error1 = { message : StringTools.replace(Std.string(e),"\n",""), source : keyVal};
			cb(error1);
		}
	}
	,_updateRecursive: function(attributeMaps,model,cb,connection) {
		var _g = this;
		var updateClause = model.getUpdateClause();
		var cols = model.getColumnSet();
		var attributeMap = attributeMaps.pop();
		var valList = [];
		var updateStr = new StringBuf();
		var i = 0;
		var $it0 = attributeMap.keys();
		while( $it0.hasNext() ) {
			var attribute = $it0.next();
			if((__map_reserved[attribute] != null?cols.existsReserved(attribute):cols.h.hasOwnProperty(attribute)) && attribute != model.getPrimaryKey_rdbms()) {
				if(attribute == "DATESTAMP") continue;
				if(i > 0) updateStr.b += ",";
				i++;
				updateStr.add(attribute + " = " + this.dbSpecificParamPlaceholder(i));
				var val;
				val = __map_reserved[attribute] != null?attributeMap.getReserved(attribute):attributeMap.h[attribute];
				if(val == "") val = null;
				valList.push(val);
			}
		}
		i++;
		var keyCol = model.getPrimaryKey_rdbms();
		var sql = updateClause + " SET " + Std.string(updateStr) + " WHERE " + keyCol + " = " + this.dbSpecificParamPlaceholder(i);
		var additionalSQL = this.generateUserConstraintSQL(model.getClass());
		if(additionalSQL != null) sql += " AND " + additionalSQL;
		valList.push(__map_reserved[keyCol] != null?attributeMap.getReserved(keyCol):attributeMap.h[keyCol]);
		this.debug("SQL" + sql);
		this.debug("Values" + Std.string(valList));
		try {
			connection.execute(sql,valList,function(err,results) {
				if(err != null) {
					saturn.core.Util.debug("Error: " + err);
					cb(err);
					_g.closeConnection(connection);
				} else if(attributeMaps.length == 0) {
					cb(null);
					_g.closeConnection(connection);
				} else _g._updateRecursive(attributeMaps,model,cb,connection);
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			this.closeConnection(connection);
			cb(e);
		}
	}
	,_delete: function(attributeMaps,className,cb) {
		var _g = this;
		var model = this.getModelByStringName(className);
		var priField = model.getPrimaryKey();
		var priFieldSql = model.getPrimaryKey_rdbms();
		var pkeys = [];
		var _g1 = 0;
		while(_g1 < attributeMaps.length) {
			var attributeMap = attributeMaps[_g1];
			++_g1;
			pkeys.push(__map_reserved[priFieldSql] != null?attributeMap.getReserved(priFieldSql):attributeMap.h[priFieldSql]);
		}
		var d = attributeMaps;
		var sql = "DELETE FROM " + this.generateQualifiedName(model.getSchemaName(),model.getTableName()) + " WHERE " + priFieldSql + " " + this.buildSqlInClause(pkeys.length);
		var additionalSQL = this.generateUserConstraintSQL(model.getClass());
		if(additionalSQL != null) sql += " AND " + additionalSQL;
		this.getConnection(this.config,function(err,connection) {
			if(err != null) cb(err); else try {
				connection.execute(sql,pkeys,function(err1,results) {
					if(err1 != null) {
						saturn.core.Util.debug("Error: " + err1);
						cb(err1);
						_g.closeConnection(connection);
					} else cb(null);
				});
			} catch( e ) {
				if (e instanceof js._Boot.HaxeError) e = e.val;
				_g.closeConnection(connection);
				cb(e);
			}
		});
	}
	,postConfigureModels: function() {
		saturn.db.DefaultProvider.prototype.postConfigureModels.call(this);
	}
	,parseObjectList: function(data) {
		return null;
	}
	,dbSpecificParamPlaceholder: function(i) {
		return ":" + i;
	}
	,getProviderType: function() {
		return "ORACLE";
	}
	,applyFunctions: function(attributeMaps,className) {
		var context = this.user;
		var model = this.getModelByStringName(className);
		var functions = model.getAutoFunctions();
		if(functions != null) {
			var $it0 = functions.keys();
			while( $it0.hasNext() ) {
				var field = $it0.next();
				var functionString;
				functionString = __map_reserved[field] != null?functions.getReserved(field):functions.h[field];
				var func = null;
				if(functionString == "insert.username") func = $bind(this,this.setUserName); else continue;
				var _g = 0;
				while(_g < attributeMaps.length) {
					var attributeMap = attributeMaps[_g];
					++_g;
					if(__map_reserved[field] != null?attributeMap.existsReserved(field):attributeMap.h.hasOwnProperty(field)) {
						var value = Reflect.callMethod(this,func,[__map_reserved[field] != null?attributeMap.getReserved(field):attributeMap.h[field],context]);
						attributeMap.set(field,value);
					}
				}
			}
		}
		return attributeMaps;
	}
	,setUserName: function(value,context) {
		if(context != null && context.username != null) return context.username.toUpperCase(); else return value;
	}
	,handleFileRequests: function(values,clazz,callBack) {
		var _g = this;
		var i = 0;
		var next = null;
		var results = [];
		next = function() {
			if(i < values.length) {
				var value = values[i];
				var key = value;
				_g.debug("Processing file requests");
				_g.debug(_g.conversions);
				var $it0 = _g.conversions.keys();
				while( $it0.hasNext() ) {
					var conversion = $it0.next();
					var replacement = _g.conversions.get(conversion);
					value = StringTools.replace(value,conversion,replacement);
				}
				if(_g.platform == "windows") value = StringTools.replace(value,"/","\\");
				_g.debug("Unlinking path " + value);
				js.Node.require("fs").realpath(value,function(err,abspath) {
					if(err != null) {
						_g.debug("File realpath error: " + err);
						callBack(null,saturn.app.SaturnServer.getStandardUserInputError());
					} else {
						var match = false;
						var $it1 = _g.regexs.keys();
						while( $it1.hasNext() ) {
							var key1 = $it1.next();
							if(_g.regexs.get(key1).match(value)) {
								match = true;
								break;
							}
						}
						if(match) {
							_g.debug("Reading path: " + abspath);
							js.Node.require("fs").readFile(abspath,null,function(err1,content) {
								if(err1 != null) {
									_g.debug("File read error: " + err1 + "/" + abspath);
									callBack(null,saturn.app.SaturnServer.getStandardUserInputError());
								} else {
									var match1 = false;
									var $it2 = _g.regexs.keys();
									while( $it2.hasNext() ) {
										var key2 = $it2.next();
										if(_g.regexs.get(key2).match(value)) {
											match1 = true;
											break;
										}
									}
									i++;
									results.push({ 'PATH' : key, 'CONTENT' : content});
									next();
								}
							});
						} else {
							_g.debug("File read error: " + err);
							callBack(null,saturn.app.SaturnServer.getStandardUserInputError());
						}
					}
				});
			} else callBack(results,null);
		};
		next();
	}
	,setConnection: function(conn) {
		this.theConnection = conn;
	}
	,_commit: function(cb) {
		this.getConnection(this.config,function(err,connection) {
			if(err != null) cb(err); else connection.commit(cb);
		});
	}
	,setAutoCommit: function(autoCommit,cb) {
		this.getConnection(this.config,function(err,conn) {
			if(err == null) {
				conn.setAutoCommit(autoCommit);
				cb(null);
			} else cb(err);
		});
	}
	,generateUserConstraintSQL: function(clazz) {
		var model = this.getModel(clazz);
		var publicConstraintField = model.getPublicConstraintField();
		var userConstraintField = model.getUserConstraintField();
		var sql = null;
		if(publicConstraintField != null) {
			var columnName = model.getSqlColumn(publicConstraintField);
			sql = " " + columnName + " = 'yes' ";
		}
		if(userConstraintField != null) {
			var inBlock = false;
			if(sql != null) {
				sql = "(" + sql + " OR ";
				inBlock = true;
			}
			var columnName1 = model.getSqlColumn(userConstraintField);
			sql = sql + columnName1 + " = '" + this.getUser().username.toUpperCase() + "'";
			if(inBlock) sql += " ) ";
		}
		return sql;
	}
	,__class__: saturn.db.provider.GenericRDBMSProvider
});
saturn.db.provider.MySQLProvider = $hxClasses["saturn.db.provider.MySQLProvider"] = function(models,config,autoClose) {
	saturn.db.provider.GenericRDBMSProvider.call(this,models,config,autoClose);
};
saturn.db.provider.MySQLProvider.__name__ = ["saturn","db","provider","MySQLProvider"];
saturn.db.provider.MySQLProvider.__super__ = saturn.db.provider.GenericRDBMSProvider;
saturn.db.provider.MySQLProvider.prototype = $extend(saturn.db.provider.GenericRDBMSProvider.prototype,{
	getColumns: function(connection,schemaName,tableName,cb) {
		var _g = this;
		connection.query("DESCRIBE " + schemaName + "." + tableName,[],function(err,rows) {
			if(err != null) {
				_g.debug("Got DESCRIBE exception on  " + tableName);
				cb(err,null);
			} else {
				var cols = [];
				var _g1 = 0;
				while(_g1 < rows.length) {
					var row = rows[_g1];
					++_g1;
					cols.push(row.Field);
				}
				cb(null,cols);
			}
		});
	}
	,getProviderType: function() {
		return "MYSQL";
	}
	,_closeConnection: function() {
		this.debug("Closing connection!");
		if(this.theConnection != null) {
			var d = this.theConnection;
			this.debug(Reflect.fields(d));
			d.close();
			this.theConnection = null;
		}
	}
	,limitAtEndPosition: function() {
		return true;
	}
	,generateLimitClause: function(limit) {
		return " limit " + (limit | 0);
	}
	,generateQualifiedName: function(schemaName,tableName) {
		return schemaName + "." + tableName;
	}
	,_getConnection: function(cb) {
		var _g = this;
		this.debug("Obtaining MySQL theDB");
		try {
			var mysql = js.Node.require("mysql2");
			var connection = mysql.createConnection({ host : this.config.host, user : this.user.username, password : this.user.password, database : this.config.database});
			this.debug("Connecting to " + Std.string(this.config.database) + " as " + this.user.username + " with password " + this.user.password + " on host " + Std.string(this.config.host));
			connection.on("connect",function(connect) {
				if(connect) {
					_g.debug("Connected");
					connection.execute = connection.query;
					cb(null,connection);
				} else {
					_g.debug("Unable to connect");
					cb("Unable to connect",null);
				}
			});
			connection.on("error",function(err) {
				_g.debug("Error connecting " + Std.string(err));
				if(!err.fatal) return;
				if(err.code != "PROTOCOL_CONNECTION_LOST") throw new js._Boot.HaxeError(err);
				_g.debug("Reconnecting!!!!");
				_g._getConnection(function(err1,conn) {
					if(err1 != null) throw new js._Boot.HaxeError("Unable to reconnect MySQL session"); else _g.theConnection = conn;
				});
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			this.debug("Error" + Std.string(e));
			cb(e,null);
			return;
		}
	}
	,dbSpecificParamPlaceholder: function(i) {
		return "?";
	}
	,__class__: saturn.db.provider.MySQLProvider
});
saturn.db.provider.OracleProvider = $hxClasses["saturn.db.provider.OracleProvider"] = function(models,config,autoClose) {
	saturn.db.provider.GenericRDBMSProvider.call(this,models,config,autoClose);
};
saturn.db.provider.OracleProvider.__name__ = ["saturn","db","provider","OracleProvider"];
saturn.db.provider.OracleProvider.__super__ = saturn.db.provider.GenericRDBMSProvider;
saturn.db.provider.OracleProvider.prototype = $extend(saturn.db.provider.GenericRDBMSProvider.prototype,{
	_getConnection: function(cb) {
		this.debug("Opening new connection as " + this.user.username);
		var oracle = js.Node.require("oracle");
		var connString = "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=" + Std.string(this.config.host) + ")(PORT=" + Std.string(this.config.port) + "))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=" + Std.string(this.config.service_name) + ")))";
		var connectData = { 'tns' : connString, 'user' : this.user.username, 'password' : this.user.password};
		oracle.connect(connectData,function(err,connection) {
			cb(err,connection);
		});
	}
	,__class__: saturn.db.provider.OracleProvider
});
saturn.db.provider.PostgreSQLProvider = $hxClasses["saturn.db.provider.PostgreSQLProvider"] = function(models,config,autoClose) {
	saturn.db.provider.GenericRDBMSProvider.call(this,models,config,autoClose);
};
saturn.db.provider.PostgreSQLProvider.__name__ = ["saturn","db","provider","PostgreSQLProvider"];
saturn.db.provider.PostgreSQLProvider.__super__ = saturn.db.provider.GenericRDBMSProvider;
saturn.db.provider.PostgreSQLProvider.prototype = $extend(saturn.db.provider.GenericRDBMSProvider.prototype,{
	getProviderType: function() {
		return "PGSQL";
	}
	,getColumns: function(connection,schemaName,tableName,cb) {
		connection.execute("\r\n            SELECT\r\n                column_name\r\n            FROM\r\n                INFORMATION_SCHEMA.columns\r\n            WHERE\r\n                LOWER(table_schema)=LOWER($1) AND\r\n                LOWER(table_name)=LOWER($2)",[schemaName,tableName],function(err,rows) {
			var cols = [];
			var _g = 0;
			while(_g < rows.length) {
				var row = rows[_g];
				++_g;
				cols.push(row.column_name);
			}
			cb(null,cols);
		});
	}
	,limitAtEndPosition: function() {
		return true;
	}
	,dbSpecificParamPlaceholder: function(i) {
		return "$" + i;
	}
	,generateLimitClause: function(limit) {
		return " LIMIT " + (limit | 0);
	}
	,columnToStringCommand: function(columnName) {
		return " cast(" + columnName + " as TEXT) ";
	}
	,_getConnection: function(cb) {
		var _g = this;
		var conString = "postgres://" + this.user.username + ":" + this.user.password + "@" + Std.string(this.config.host) + "/" + Std.string(this.config.database);
		var pg = js.Node.require("pg");
		pg.connect(conString,function(err,client) {
			if(err != null) {
				_g.debug("Error connecting to PostgreSQL");
				cb(err,null);
			} else {
				client.execute = function(sql,args,cb1) {
					client.query(sql,args,function(err1,results) {
						if(err1 == null) cb1(null,results.rows); else cb1(err1,null);
					});
				};
				cb(null,client);
			}
		});
	}
	,__class__: saturn.db.provider.PostgreSQLProvider
});
saturn.db.provider.SQLiteProvider = $hxClasses["saturn.db.provider.SQLiteProvider"] = function(models,config,autoClose) {
	saturn.db.provider.GenericRDBMSProvider.call(this,models,config,autoClose);
};
saturn.db.provider.SQLiteProvider.__name__ = ["saturn","db","provider","SQLiteProvider"];
saturn.db.provider.SQLiteProvider.__super__ = saturn.db.provider.GenericRDBMSProvider;
saturn.db.provider.SQLiteProvider.prototype = $extend(saturn.db.provider.GenericRDBMSProvider.prototype,{
	getProviderType: function() {
		return "SQLITE";
	}
	,getColumns: function(connection,schemaName,tableName,cb) {
		var _g = this;
		this.debug("Getting columns for " + tableName);
		connection.serialize(function() {
			connection.all("PRAGMA table_info(" + tableName + ")",[],function(err,rows) {
				if(err != null) {
					_g.debug("Got pragma exception on  " + tableName);
					cb(err,null);
				} else {
					var cols = [];
					var _g1 = 0;
					while(_g1 < rows.length) {
						var row = rows[_g1];
						++_g1;
						cols.push(row.name);
					}
					cb(null,cols);
				}
			});
		});
	}
	,generateQualifiedName: function(schemaName,tableName) {
		return tableName;
	}
	,_getConnection: function(cb) {
		try {
			var conn = new Sqlite3(this.config.file_name);
			this.debug("Got connection");
			conn.execute = conn.all;
			cb(null,conn);
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			this.debug("Error" + Std.string(e));
			cb(e,null);
		}
	}
	,limitAtEndPosition: function() {
		return true;
	}
	,generateLimitClause: function(limit) {
		return " limit " + (limit | 0);
	}
	,__class__: saturn.db.provider.SQLiteProvider
});
if(!saturn.db.provider.hooks) saturn.db.provider.hooks = {};
saturn.db.provider.hooks.ExternalJsonHook = $hxClasses["saturn.db.provider.hooks.ExternalJsonHook"] = function() { };
saturn.db.provider.hooks.ExternalJsonHook.__name__ = ["saturn","db","provider","hooks","ExternalJsonHook"];
saturn.db.provider.hooks.ExternalJsonHook.run = function(query,params,clazz,cb,hookConfig) {
	saturn.core.Util.debug("Running external command");
	if(hookConfig == null) {
		cb(null,"Hook configuration is missing");
		return;
	}
	var program = null;
	if(Object.prototype.hasOwnProperty.call(hookConfig,"program")) program = Reflect.field(hookConfig,"program"); else {
		cb(null,"Invalid configuration, program field missing");
		return;
	}
	var progArguments = [];
	if(Object.prototype.hasOwnProperty.call(hookConfig,"arguments")) {
		var localprogArguments = Reflect.field(hookConfig,"arguments");
		var _g = 0;
		while(_g < localprogArguments.length) {
			var arg = localprogArguments[_g];
			++_g;
			progArguments.push(arg);
		}
	}
	var config = params[0];
	bindings.NodeTemp.open("input_json",function(err,fh_input) {
		if(err != null) {
			saturn.core.Util.debug("Error generating temporary input file name");
			cb(null,err);
		} else {
			var run = function() {
				var inputJsonStr = JSON.stringify(config);
				saturn.core.Util.debug(inputJsonStr);
				js.Node.require("fs").writeFileSync(fh_input.path,inputJsonStr);
				bindings.NodeTemp.open("output_json",function(err1,fh_output) {
					if(err1 != null) {
						saturn.core.Util.debug("Error generating temporary output file name");
						cb(null,err1);
					} else {
						progArguments.push(fh_input.path);
						progArguments.push(fh_output.path);
						saturn.core.Util.inspect(progArguments);
						saturn.core.Util.print(program);
						var p = js.Node.require("child_process").spawn(program,progArguments);
						p.stderr.on("data",function(data) {
							saturn.core.Util.debug(data.toString());
						});
						p.stdout.on("data",function(data1) {
							saturn.core.Util.debug(data1.toString());
						});
						p.on("close",function(retVal) {
							if(retVal == "0") {
								var jsonStr = js.Node.require("fs").readFileSync(fh_output.path,{ encoding : "utf8"});
								js.Node.require("fs").unlinkSync(fh_output.path);
								js.Node.require("fs").unlinkSync(fh_input.path);
								var jsonObj = JSON.parse(jsonStr);
								var error = null;
								if(Object.prototype.hasOwnProperty.call(jsonObj,"error")) error = Reflect.field(jsonObj,"error");
								cb([jsonObj],error);
							} else {
								saturn.core.Util.debug("External process has failed");
								cb(null,"External process returned a non-zero exit status");
							}
						});
					}
				});
			};
			var fields = Reflect.fields(config);
			var next = null;
			next = function() {
				if(fields.length == 0) run(); else {
					var field = fields.pop();
					if(field.indexOf("upload_key") == 0) {
						saturn.core.Util.debug("Found upload key");
						var saturn1 = saturn.app.SaturnServer.getDefaultServer();
						var redis = saturn1.getRedisClient();
						var upload_key = Reflect.field(config,field);
						var path1 = redis.get(upload_key,function(err2,path) {
							if(path == null) {
								cb(null,"Invalid file upload key " + upload_key);
								return;
							} else {
								config[field] = path;
								next();
							}
						});
					} else if(field.indexOf("out_file") == 0) {
						var saturn2 = saturn.app.SaturnServer.getDefaultServer();
						var baseFolder = saturn2.getRelativePublicOuputFolder();
						config[field] = baseFolder;
						next();
					} else next();
				}
			};
			next();
		}
	});
};
saturn.db.provider.hooks.RawSQLHook = $hxClasses["saturn.db.provider.hooks.RawSQLHook"] = function() { };
saturn.db.provider.hooks.RawSQLHook.__name__ = ["saturn","db","provider","hooks","RawSQLHook"];
saturn.db.provider.hooks.RawSQLHook.run = function(query,params,clazz,cb,hookConfig) {
	var sql = params[0];
	var args = params[1];
	saturn.core.Util.getProvider().getConnection(null,function(err,conn) {
		conn.execute(sql,args,function(err1,results) {
			cb(results,err1);
		});
	});
};
if(!saturn.db.query_lang) saturn.db.query_lang = {};
saturn.db.query_lang.Token = $hxClasses["saturn.db.query_lang.Token"] = function(tokens) {
	this.tokens = tokens;
	if(this.tokens != null) {
		var _g1 = 0;
		var _g = this.tokens.length;
		while(_g1 < _g) {
			var i = _g1++;
			var value = this.tokens[i];
			if(value != null) {
				if(!js.Boot.__instanceof(value,saturn.db.query_lang.Token)) this.tokens[i] = new saturn.db.query_lang.Value(value);
			}
		}
	}
};
saturn.db.query_lang.Token.__name__ = ["saturn","db","query_lang","Token"];
saturn.db.query_lang.Token.prototype = {
	tokens: null
	,name: null
	,'as': function(name) {
		this.name = name;
		return this;
	}
	,getTokens: function() {
		return this.tokens;
	}
	,setTokens: function(tokens) {
		this.tokens = tokens;
	}
	,addToken: function(token) {
		if(this.tokens == null) this.tokens = [];
		this.tokens.push(token);
		return this;
	}
	,field: function(clazz,attributeName,clazzAlias) {
		var f = new saturn.db.query_lang.Field(clazz,attributeName,clazzAlias);
		this.add(f);
		return f;
	}
	,add: function(token) {
		if(js.Boot.__instanceof(token,saturn.db.query_lang.Operator)) {
			var n = new saturn.db.query_lang.Token();
			n.add(this);
			n.tokens.push(token);
			return n;
		} else return this.addToken(token);
	}
	,removeToken: function(token) {
		HxOverrides.remove(this.tokens,token);
	}
	,like: function(token) {
		var l = new saturn.db.query_lang.Like();
		if(token != null) l.add(token);
		return this.add(l);
	}
	,concat: function(token) {
		var c = new saturn.db.query_lang.Concat(token);
		return this.add(c);
	}
	,substr: function(position,length) {
		return new saturn.db.query_lang.Substr(this,position,length);
	}
	,instr: function(substring,position,occurrence) {
		return new saturn.db.query_lang.Instr(this,substring,position,occurrence);
	}
	,max: function() {
		return new saturn.db.query_lang.Max(this);
	}
	,length: function() {
		return new saturn.db.query_lang.Length(this);
	}
	,plus: function(token) {
		var c = new saturn.db.query_lang.Plus(token);
		return this.add(c);
	}
	,minus: function(token) {
		var c = new saturn.db.query_lang.Minus(token);
		return this.add(c);
	}
	,getClassList: function() {
		var list = [];
		var tokens = this.getTokens();
		if(tokens != null && tokens.length > 0) {
			var _g = 0;
			while(_g < tokens.length) {
				var token = tokens[_g];
				++_g;
				if(js.Boot.__instanceof(token,saturn.db.query_lang.ClassToken)) {
					var cToken;
					cToken = js.Boot.__cast(token , saturn.db.query_lang.ClassToken);
					if(cToken.getClass() != null) list.push(cToken.getClass());
				} else {
					var list2 = token.getClassList();
					var _g1 = 0;
					while(_g1 < list2.length) {
						var item = list2[_g1];
						++_g1;
						list.push(item);
					}
				}
			}
		}
		return list;
	}
	,__class__: saturn.db.query_lang.Token
};
saturn.db.query_lang.Operator = $hxClasses["saturn.db.query_lang.Operator"] = function(token) {
	if(token != null) saturn.db.query_lang.Token.call(this,[token]); else saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.Operator.__name__ = ["saturn","db","query_lang","Operator"];
saturn.db.query_lang.Operator.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Operator.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Operator
});
saturn.db.query_lang.And = $hxClasses["saturn.db.query_lang.And"] = function() {
	saturn.db.query_lang.Operator.call(this,null);
};
saturn.db.query_lang.And.__name__ = ["saturn","db","query_lang","And"];
saturn.db.query_lang.And.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.And.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.And
});
saturn.db.query_lang.ClassToken = $hxClasses["saturn.db.query_lang.ClassToken"] = function(clazz) {
	this.setClass(clazz);
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.ClassToken.__name__ = ["saturn","db","query_lang","ClassToken"];
saturn.db.query_lang.ClassToken.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.ClassToken.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	clazz: null
	,getClass: function() {
		return this.clazz;
	}
	,setClass: function(clazz) {
		if(js.Boot.__instanceof(clazz,Class)) {
			var c;
			c = js.Boot.__cast(clazz , Class);
			this.clazz = Type.getClassName(c);
		} else this.clazz = clazz;
	}
	,__class__: saturn.db.query_lang.ClassToken
});
saturn.db.query_lang.Concat = $hxClasses["saturn.db.query_lang.Concat"] = function(value) {
	if(value == null) saturn.db.query_lang.Operator.call(this,null); else saturn.db.query_lang.Operator.call(this,value);
};
saturn.db.query_lang.Concat.__name__ = ["saturn","db","query_lang","Concat"];
saturn.db.query_lang.Concat.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Concat.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Concat
});
saturn.db.query_lang.Function = $hxClasses["saturn.db.query_lang.Function"] = function(tokens) {
	saturn.db.query_lang.Token.call(this,tokens);
};
saturn.db.query_lang.Function.__name__ = ["saturn","db","query_lang","Function"];
saturn.db.query_lang.Function.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Function.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Function
});
saturn.db.query_lang.Count = $hxClasses["saturn.db.query_lang.Count"] = function(token) {
	saturn.db.query_lang.Function.call(this,[token]);
};
saturn.db.query_lang.Count.__name__ = ["saturn","db","query_lang","Count"];
saturn.db.query_lang.Count.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Count.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Count
});
saturn.db.query_lang.EndBlock = $hxClasses["saturn.db.query_lang.EndBlock"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.EndBlock.__name__ = ["saturn","db","query_lang","EndBlock"];
saturn.db.query_lang.EndBlock.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.EndBlock.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.EndBlock
});
saturn.db.query_lang.Equals = $hxClasses["saturn.db.query_lang.Equals"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.Equals.__name__ = ["saturn","db","query_lang","Equals"];
saturn.db.query_lang.Equals.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Equals.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Equals
});
saturn.db.query_lang.Field = $hxClasses["saturn.db.query_lang.Field"] = function(clazz,attributeName,clazzAlias) {
	this.setClass(clazz);
	this.attributeName = attributeName;
	this.clazzAlias = clazzAlias;
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.Field.__name__ = ["saturn","db","query_lang","Field"];
saturn.db.query_lang.Field.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Field.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	clazz: null
	,clazzAlias: null
	,attributeName: null
	,getClass: function() {
		return this.clazz;
	}
	,setClass: function(clazz) {
		if(js.Boot.__instanceof(clazz,Class)) {
			var c;
			c = js.Boot.__cast(clazz , Class);
			this.clazz = Type.getClassName(c);
		} else this.clazz = clazz;
	}
	,getAttributeName: function() {
		return this.attributeName;
	}
	,setAttributeName: function(name) {
		this.attributeName = name;
	}
	,__class__: saturn.db.query_lang.Field
});
saturn.db.query_lang.From = $hxClasses["saturn.db.query_lang.From"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.From.__name__ = ["saturn","db","query_lang","From"];
saturn.db.query_lang.From.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.From.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.From
});
saturn.db.query_lang.GreaterThan = $hxClasses["saturn.db.query_lang.GreaterThan"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.GreaterThan.__name__ = ["saturn","db","query_lang","GreaterThan"];
saturn.db.query_lang.GreaterThan.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.GreaterThan.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.GreaterThan
});
saturn.db.query_lang.GreaterThanOrEqualTo = $hxClasses["saturn.db.query_lang.GreaterThanOrEqualTo"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.GreaterThanOrEqualTo.__name__ = ["saturn","db","query_lang","GreaterThanOrEqualTo"];
saturn.db.query_lang.GreaterThanOrEqualTo.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.GreaterThanOrEqualTo.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.GreaterThanOrEqualTo
});
saturn.db.query_lang.Group = $hxClasses["saturn.db.query_lang.Group"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.Group.__name__ = ["saturn","db","query_lang","Group"];
saturn.db.query_lang.Group.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Group.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Group
});
saturn.db.query_lang.In = $hxClasses["saturn.db.query_lang.In"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.In.__name__ = ["saturn","db","query_lang","In"];
saturn.db.query_lang.In.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.In.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.In
});
saturn.db.query_lang.Instr = $hxClasses["saturn.db.query_lang.Instr"] = function(value,substring,position,occurrence) {
	if(position == null) position = new saturn.db.query_lang.Value(1);
	if(occurrence == null) occurrence = new saturn.db.query_lang.Value(1);
	saturn.db.query_lang.Function.call(this,[value,substring,position,occurrence]);
};
saturn.db.query_lang.Instr.__name__ = ["saturn","db","query_lang","Instr"];
saturn.db.query_lang.Instr.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Instr.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Instr
});
saturn.db.query_lang.IsNotNull = $hxClasses["saturn.db.query_lang.IsNotNull"] = function() {
	saturn.db.query_lang.Operator.call(this,null);
};
saturn.db.query_lang.IsNotNull.__name__ = ["saturn","db","query_lang","IsNotNull"];
saturn.db.query_lang.IsNotNull.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.IsNotNull.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.IsNotNull
});
saturn.db.query_lang.IsNull = $hxClasses["saturn.db.query_lang.IsNull"] = function() {
	this.empty = "NULL";
	saturn.db.query_lang.Operator.call(this,null);
};
saturn.db.query_lang.IsNull.__name__ = ["saturn","db","query_lang","IsNull"];
saturn.db.query_lang.IsNull.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.IsNull.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	empty: null
	,__class__: saturn.db.query_lang.IsNull
});
saturn.db.query_lang.Length = $hxClasses["saturn.db.query_lang.Length"] = function(value) {
	saturn.db.query_lang.Function.call(this,[value]);
};
saturn.db.query_lang.Length.__name__ = ["saturn","db","query_lang","Length"];
saturn.db.query_lang.Length.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Length.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Length
});
saturn.db.query_lang.LessThan = $hxClasses["saturn.db.query_lang.LessThan"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.LessThan.__name__ = ["saturn","db","query_lang","LessThan"];
saturn.db.query_lang.LessThan.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.LessThan.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.LessThan
});
saturn.db.query_lang.LessThanOrEqualTo = $hxClasses["saturn.db.query_lang.LessThanOrEqualTo"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.LessThanOrEqualTo.__name__ = ["saturn","db","query_lang","LessThanOrEqualTo"];
saturn.db.query_lang.LessThanOrEqualTo.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.LessThanOrEqualTo.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.LessThanOrEqualTo
});
saturn.db.query_lang.Like = $hxClasses["saturn.db.query_lang.Like"] = function() {
	saturn.db.query_lang.Operator.call(this,null);
};
saturn.db.query_lang.Like.__name__ = ["saturn","db","query_lang","Like"];
saturn.db.query_lang.Like.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Like.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Like
});
saturn.db.query_lang.Limit = $hxClasses["saturn.db.query_lang.Limit"] = function(limit) {
	saturn.db.query_lang.Token.call(this,[limit]);
};
saturn.db.query_lang.Limit.__name__ = ["saturn","db","query_lang","Limit"];
saturn.db.query_lang.Limit.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Limit.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Limit
});
saturn.db.query_lang.Max = $hxClasses["saturn.db.query_lang.Max"] = function(value) {
	saturn.db.query_lang.Function.call(this,[value]);
};
saturn.db.query_lang.Max.__name__ = ["saturn","db","query_lang","Max"];
saturn.db.query_lang.Max.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Max.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Max
});
saturn.db.query_lang.Minus = $hxClasses["saturn.db.query_lang.Minus"] = function(value) {
	if(value == null) saturn.db.query_lang.Operator.call(this,null); else saturn.db.query_lang.Operator.call(this,value);
};
saturn.db.query_lang.Minus.__name__ = ["saturn","db","query_lang","Minus"];
saturn.db.query_lang.Minus.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Minus.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Minus
});
saturn.db.query_lang.NotEquals = $hxClasses["saturn.db.query_lang.NotEquals"] = function(token) {
	saturn.db.query_lang.Operator.call(this,token);
};
saturn.db.query_lang.NotEquals.__name__ = ["saturn","db","query_lang","NotEquals"];
saturn.db.query_lang.NotEquals.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.NotEquals.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.NotEquals
});
saturn.db.query_lang.Or = $hxClasses["saturn.db.query_lang.Or"] = function() {
	saturn.db.query_lang.Operator.call(this,null);
};
saturn.db.query_lang.Or.__name__ = ["saturn","db","query_lang","Or"];
saturn.db.query_lang.Or.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Or.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Or
});
saturn.db.query_lang.OrderBy = $hxClasses["saturn.db.query_lang.OrderBy"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.OrderBy.__name__ = ["saturn","db","query_lang","OrderBy"];
saturn.db.query_lang.OrderBy.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.OrderBy.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.OrderBy
});
saturn.db.query_lang.OrderByItem = $hxClasses["saturn.db.query_lang.OrderByItem"] = function(token,descending) {
	if(descending == null) descending = false;
	this.descending = false;
	this.descending = descending;
	saturn.db.query_lang.Token.call(this,[token]);
};
saturn.db.query_lang.OrderByItem.__name__ = ["saturn","db","query_lang","OrderByItem"];
saturn.db.query_lang.OrderByItem.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.OrderByItem.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	descending: null
	,__class__: saturn.db.query_lang.OrderByItem
});
saturn.db.query_lang.Plus = $hxClasses["saturn.db.query_lang.Plus"] = function(value) {
	if(value == null) saturn.db.query_lang.Operator.call(this,null); else saturn.db.query_lang.Operator.call(this,value);
};
saturn.db.query_lang.Plus.__name__ = ["saturn","db","query_lang","Plus"];
saturn.db.query_lang.Plus.__super__ = saturn.db.query_lang.Operator;
saturn.db.query_lang.Plus.prototype = $extend(saturn.db.query_lang.Operator.prototype,{
	__class__: saturn.db.query_lang.Plus
});
saturn.db.query_lang.Query = $hxClasses["saturn.db.query_lang.Query"] = function(provider) {
	saturn.db.query_lang.Token.call(this,null);
	this.provider = provider;
	this.selectToken = new saturn.db.query_lang.Select();
	this.whereToken = new saturn.db.query_lang.Where();
	this.fromToken = new saturn.db.query_lang.From();
	this.groupToken = new saturn.db.query_lang.Group();
	this.orderToken = new saturn.db.query_lang.OrderBy();
};
saturn.db.query_lang.Query.__name__ = ["saturn","db","query_lang","Query"];
saturn.db.query_lang.Query.deserialise = function(querySer) {
	var clone = haxe.Unserializer.run(querySer);
	saturn.db.query_lang.Query.deserialiseToken(clone);
	return clone;
};
saturn.db.query_lang.Query.deserialiseToken = function(token) {
	if(token == null) return;
	if(token.getTokens() != null) {
		var _g = 0;
		var _g1 = token.getTokens();
		while(_g < _g1.length) {
			var token1 = _g1[_g];
			++_g;
			saturn.db.query_lang.Query.deserialiseToken(token1);
		}
	}
	if(js.Boot.__instanceof(token,saturn.db.query_lang.Query)) {
		var qToken;
		qToken = js.Boot.__cast(token , saturn.db.query_lang.Query);
		qToken.provider = null;
	}
};
saturn.db.query_lang.Query.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Query.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	selectToken: null
	,fromToken: null
	,whereToken: null
	,groupToken: null
	,orderToken: null
	,provider: null
	,rawResults: null
	,pageOn: null
	,pageSize: null
	,lastPagedRowValue: null
	,setPageOnToken: function(t) {
		this.pageOn = t;
	}
	,getPageOnToken: function() {
		return this.pageOn;
	}
	,setLastPagedRowValue: function(t) {
		this.lastPagedRowValue = t;
	}
	,getLastPagedRowValue: function() {
		return this.lastPagedRowValue;
	}
	,setPageSize: function(t) {
		this.pageSize = t;
	}
	,getPageSize: function() {
		return this.pageSize;
	}
	,isPaging: function() {
		return this.pageOn != null && this.pageSize != null;
	}
	,configurePaging: function(pageOn,pageSize) {
		this.pageOn = pageOn;
		this.pageSize = pageSize;
	}
	,fetchRawResults: function() {
		this.rawResults = true;
	}
	,bindResults: function() {
		return !this.rawResults;
	}
	,getTokens: function() {
		var tokens = [];
		var checkTokens = [this.selectToken,this.whereToken];
		var _g = 0;
		while(_g < checkTokens.length) {
			var token = checkTokens[_g];
			++_g;
			this.addClassToken(token);
		}
		if(this.fromToken.getTokens() != null) {
			var seen = new haxe.ds.StringMap();
			var tokens1 = [];
			var _g1 = 0;
			var _g11 = this.fromToken.getTokens();
			while(_g1 < _g11.length) {
				var token1 = _g11[_g1];
				++_g1;
				if(js.Boot.__instanceof(token1,saturn.db.query_lang.ClassToken)) {
					var cToken;
					cToken = js.Boot.__cast(token1 , saturn.db.query_lang.ClassToken);
					if(cToken.getClass() != null) {
						var clazzName = cToken.getClass();
						if(!(__map_reserved[clazzName] != null?seen.existsReserved(clazzName):seen.h.hasOwnProperty(clazzName))) {
							tokens1.push(cToken);
							if(__map_reserved[clazzName] != null) seen.setReserved(clazzName,""); else seen.h[clazzName] = "";
						}
					} else tokens1.push(cToken);
				} else tokens1.push(token1);
			}
			this.fromToken.setTokens(tokens1);
			saturn.core.Util.print("Num targets" + this.fromToken.getTokens().length);
		}
		tokens.push(this.selectToken);
		tokens.push(this.fromToken);
		if(this.whereToken.getTokens() != null && this.whereToken.getTokens().length > 0) {
			tokens.push(this.whereToken);
			if(this.isPaging() && this.lastPagedRowValue != null) {
				tokens.push(new saturn.db.query_lang.And());
				tokens.push(this.pageOn);
				tokens.push(new saturn.db.query_lang.GreaterThan());
				tokens.push(this.lastPagedRowValue);
			}
		}
		if(this.groupToken.getTokens() != null && this.groupToken.getTokens().length > 0) tokens.push(this.groupToken);
		if(this.orderToken.getTokens() != null && this.orderToken.getTokens().length > 0) tokens.push(this.orderToken);
		if(this.isPaging()) {
			tokens.push(new saturn.db.query_lang.OrderBy());
			tokens.push(new saturn.db.query_lang.OrderByItem(this.pageOn));
			tokens.push(new saturn.db.query_lang.Limit(this.pageSize));
		}
		if(this.tokens != null && this.tokens.length > 0) {
			var _g2 = 0;
			var _g12 = this.tokens;
			while(_g2 < _g12.length) {
				var token2 = _g12[_g2];
				++_g2;
				tokens.push(token2);
			}
		}
		return tokens;
	}
	,or: function() {
		this.getWhere().addToken(new saturn.db.query_lang.Or());
	}
	,and: function() {
		this.getWhere().addToken(new saturn.db.query_lang.And());
	}
	,equals: function(clazz,field,value) {
		this.getWhere().addToken(new saturn.db.query_lang.Field(clazz,field));
		this.getWhere().addToken(new saturn.db.query_lang.Equals());
		this.getWhere().addToken(new saturn.db.query_lang.Value(value));
	}
	,select: function(clazz,field) {
		this.getSelect().addToken(new saturn.db.query_lang.Field(clazz,field));
	}
	,getSelect: function() {
		return this.selectToken;
	}
	,getFrom: function() {
		return this.fromToken;
	}
	,getWhere: function() {
		return this.whereToken;
	}
	,getGroup: function() {
		return this.groupToken;
	}
	,clone: function() {
		var str = this.serialise();
		return saturn.db.query_lang.Query.deserialise(str);
	}
	,serialise: function() {
		var keepMe = this.provider;
		this.provider = null;
		var newMe = haxe.Serializer.run(this);
		this.provider = keepMe;
		return newMe;
	}
	,__getstate__: function() {
		var state = Syntax.pythonCode("dict(self.__dict__)");
		Syntax.pythonCode("del state['provider']");
		return state;
	}
	,run: function(cb) {
		var _g = this;
		var clone = this.clone();
		clone.provider = null;
		clone.getTokens();
		this.provider.query(clone,function(objs,err) {
			if(err == null && objs.length > 0 && _g.isPaging()) {
				var fieldName = null;
				if(_g.pageOn.name != null) fieldName = _g.pageOn.name; else if(js.Boot.__instanceof(_g.pageOn,saturn.db.query_lang.Field)) {
					var fToken;
					fToken = js.Boot.__cast(_g.pageOn , saturn.db.query_lang.Field);
					fieldName = fToken.getAttributeName();
				}
				if(fieldName == null) err = "Unable to determine value of last paged row"; else _g.setLastPagedRowValue(new saturn.db.query_lang.Value(Reflect.field(objs[objs.length - 1],fieldName)));
			}
			cb(objs,err);
		});
	}
	,getSelectClassList: function() {
		var set = new haxe.ds.StringMap();
		var _g = 0;
		var _g1 = this.selectToken.getTokens();
		while(_g < _g1.length) {
			var token = _g1[_g];
			++_g;
			if(js.Boot.__instanceof(token,saturn.db.query_lang.Field)) {
				var cToken;
				cToken = js.Boot.__cast(token , saturn.db.query_lang.Field);
				var clazz = cToken.getClass();
				if(clazz != null) {
					if(__map_reserved[clazz] != null) set.setReserved(clazz,clazz); else set.h[clazz] = clazz;
				}
			}
		}
		var list = [];
		var $it0 = set.keys();
		while( $it0.hasNext() ) {
			var className = $it0.next();
			list.push(__map_reserved[className] != null?set.getReserved(className):set.h[className]);
		}
		return list;
	}
	,unbindFields: function(token) {
		if(token == null) return;
		if(js.Boot.__instanceof(token,saturn.db.query_lang.Field)) {
			var cToken;
			cToken = js.Boot.__cast(token , saturn.db.query_lang.Field);
			var clazz = cToken.getClass();
			var field = cToken.getAttributeName();
			var model = this.provider.getModelByStringName(clazz);
			if(model != null) {
				if(field != "*") {
					var unboundFieldName = model.unbindFieldName(field);
					cToken.setAttributeName(unboundFieldName);
				}
			}
		}
		if(token.getTokens() != null) {
			var _g = 0;
			var _g1 = token.getTokens();
			while(_g < _g1.length) {
				var token1 = _g1[_g];
				++_g;
				this.unbindFields(token1);
			}
		}
	}
	,addClassToken: function(token) {
		if(js.Boot.__instanceof(token,saturn.db.query_lang.Query) || token == null) return;
		if(js.Boot.__instanceof(token,saturn.db.query_lang.Field)) {
			var fToken;
			fToken = js.Boot.__cast(token , saturn.db.query_lang.Field);
			if(fToken.getClass() != null) {
				var cToken = new saturn.db.query_lang.ClassToken(fToken.getClass());
				if(fToken.clazzAlias != null) cToken.name = fToken.clazzAlias;
				this.fromToken.addToken(cToken);
			}
		}
		if(token.getTokens() != null) {
			var _g = 0;
			var _g1 = token.getTokens();
			while(_g < _g1.length) {
				var token1 = _g1[_g];
				++_g;
				this.addClassToken(token1);
			}
		}
	}
	,addExample: function(obj,fieldList) {
		var clazz = Type.getClass(obj);
		var model = this.provider.getModel(clazz);
		if(fieldList != null) {
			if(fieldList.length > 0) {
				var _g = 0;
				while(_g < fieldList.length) {
					var field = fieldList[_g];
					++_g;
					this.getSelect().addToken(new saturn.db.query_lang.Field(clazz,field));
				}
			}
		} else this.getSelect().addToken(new saturn.db.query_lang.Field(clazz,"*"));
		var fields = model.getFields();
		var hasPrevious = false;
		this.getWhere().addToken(new saturn.db.query_lang.StartBlock());
		var _g1 = 0;
		var _g2 = fields.length;
		while(_g1 < _g2) {
			var i = _g1++;
			var field1 = fields[i];
			var value = Reflect.field(obj,field1);
			if(value != null) {
				if(hasPrevious) this.getWhere().addToken(new saturn.db.query_lang.And());
				this.getWhere().addToken(new saturn.db.query_lang.Field(clazz,field1));
				this.getWhere().addToken(new saturn.db.query_lang.Equals());
				if(js.Boot.__instanceof(value,saturn.db.query_lang.IsNull)) {
					saturn.core.Util.print("Found NULL");
					this.getWhere().addToken(new saturn.db.query_lang.IsNull());
				} else if(js.Boot.__instanceof(value,saturn.db.query_lang.IsNotNull)) this.getWhere().addToken(new saturn.db.query_lang.IsNotNull()); else {
					saturn.core.Util.print("Found value" + Type.getClassName(value == null?null:js.Boot.getClass(value)));
					this.getWhere().addToken(new saturn.db.query_lang.Value(value));
				}
				hasPrevious = true;
			}
		}
		this.getWhere().addToken(new saturn.db.query_lang.EndBlock());
	}
	,__class__: saturn.db.query_lang.Query
});
saturn.db.query_lang.QueryTests = $hxClasses["saturn.db.query_lang.QueryTests"] = function() {
};
saturn.db.query_lang.QueryTests.__name__ = ["saturn","db","query_lang","QueryTests"];
saturn.db.query_lang.QueryTests.prototype = {
	test1: function() {
		var query = new saturn.db.query_lang.Query(saturn.core.Util.getProvider());
		query.getSelect().addToken(new saturn.db.query_lang.Field(saturn.core.domain.SgcAllele,"alleleId",null));
		var visitor = new saturn.db.query_lang.SQLVisitor(saturn.core.Util.getProvider());
		visitor.translate(query);
	}
	,__class__: saturn.db.query_lang.QueryTests
};
saturn.db.query_lang.QueryVisitor = $hxClasses["saturn.db.query_lang.QueryVisitor"] = function() { };
saturn.db.query_lang.QueryVisitor.__name__ = ["saturn","db","query_lang","QueryVisitor"];
saturn.db.query_lang.QueryVisitor.prototype = {
	translateQuery: null
	,__class__: saturn.db.query_lang.QueryVisitor
};
saturn.db.query_lang.SQLVisitor = $hxClasses["saturn.db.query_lang.SQLVisitor"] = function(provider,valPos,aliasToGenerated,nextAliasId) {
	if(nextAliasId == null) nextAliasId = 0;
	if(valPos == null) valPos = 1;
	this.provider = provider;
	this.values = [];
	this.valPos = valPos;
	if(aliasToGenerated == null) this.aliasToGenerated = new haxe.ds.StringMap(); else this.aliasToGenerated = aliasToGenerated;
	this.nextAliasId = nextAliasId;
};
saturn.db.query_lang.SQLVisitor.__name__ = ["saturn","db","query_lang","SQLVisitor"];
saturn.db.query_lang.SQLVisitor.prototype = {
	provider: null
	,values: null
	,valPos: null
	,nextAliasId: null
	,aliasToGenerated: null
	,generatedToAlias: null
	,generateId: function(alias,baseValue) {
		if(baseValue == null) baseValue = "ALIAS_";
		if(this.aliasToGenerated.exists(alias)) return this.aliasToGenerated.get(alias);
		this.nextAliasId++;
		var id = baseValue + this.nextAliasId;
		this.aliasToGenerated.set(alias,id);
		saturn.core.Util.debug("Mapping" + alias + " to  " + id);
		return id;
	}
	,getNextValuePosition: function() {
		return this.valPos;
	}
	,getNextAliasId: function() {
		return this.nextAliasId;
	}
	,getValues: function() {
		return this.values;
	}
	,translate: function(token) {
		var sqlTranslation = "";
		if(token == null) {
		} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Query)) {
			var query;
			query = js.Boot.__cast(token , saturn.db.query_lang.Query);
			this.postProcess(query);
			var sqlQuery = "";
			var tokens = query.getTokens();
			var _g = 0;
			while(_g < tokens.length) {
				var token1 = tokens[_g];
				++_g;
				sqlTranslation += Std.string(this.translate(token1));
			}
		} else {
			var nestedTranslation = "";
			if(token.getTokens() != null) {
				var tokenTranslations = [];
				if(js.Boot.__instanceof(token,saturn.db.query_lang.Instr)) {
					if(this.provider.getProviderType() == "SQLITE") {
						token.tokens.pop();
						token.tokens.pop();
					}
				}
				var _g1 = 0;
				var _g11 = token.getTokens();
				while(_g1 < _g11.length) {
					var token2 = _g11[_g1];
					++_g1;
					if(js.Boot.__instanceof(token2,saturn.db.query_lang.Query)) {
						var subVisitor = new saturn.db.query_lang.SQLVisitor(this.provider,this.valPos,this.aliasToGenerated,this.nextAliasId);
						this.valPos = subVisitor.getNextValuePosition();
						this.nextAliasId = subVisitor.getNextAliasId();
						var generatedAlias = "";
						if(token2.name != null && token2.name != "") generatedAlias = this.generateId(token2.name);
						tokenTranslations.push("(" + Std.string(subVisitor.translate(token2)) + ") " + generatedAlias + " ");
						var _g2 = 0;
						var _g3 = subVisitor.getValues();
						while(_g2 < _g3.length) {
							var value = _g3[_g2];
							++_g2;
							this.values.push(value);
						}
					} else tokenTranslations.push(this.translate(token2));
				}
				var joinSep = " ";
				if(js.Boot.__instanceof(token,saturn.db.query_lang.Select) || js.Boot.__instanceof(token,saturn.db.query_lang.From) || js.Boot.__instanceof(token,saturn.db.query_lang.Function) || js.Boot.__instanceof(token,saturn.db.query_lang.Group) || js.Boot.__instanceof(token,saturn.db.query_lang.OrderBy)) joinSep = ",";
				nestedTranslation = tokenTranslations.join(joinSep);
			}
			if(js.Boot.__instanceof(token,saturn.db.query_lang.Value)) {
				var cToken;
				cToken = js.Boot.__cast(token , saturn.db.query_lang.Value);
				this.values.push(cToken.getValue());
				sqlTranslation += " " + this.getParameterNotation(this.valPos++) + " " + nestedTranslation + " ";
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Function)) {
				if(js.Boot.__instanceof(token,saturn.db.query_lang.Trim)) {
					if(this.provider.getProviderType() == "SQLITE") sqlTranslation += "ltrim(" + nestedTranslation + ",'0'" + ")"; else sqlTranslation += "Trim( leading '0' from " + nestedTranslation + ")";
				} else {
					var funcName = "";
					if(js.Boot.__instanceof(token,saturn.db.query_lang.Max)) funcName = "MAX"; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Count)) funcName = "COUNT"; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Instr)) funcName = "INSTR"; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Substr)) funcName = "SUBSTR"; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Length)) funcName = "LENGTH";
					sqlTranslation += funcName + "( " + nestedTranslation + " )";
				}
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Select)) sqlTranslation += " SELECT " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Field)) {
				var cToken1;
				cToken1 = js.Boot.__cast(token , saturn.db.query_lang.Field);
				var clazzName = cToken1.getClass();
				var fieldPrefix = null;
				var fieldName = null;
				if(cToken1.clazzAlias != null) fieldPrefix = this.generateId(cToken1.clazzAlias);
				if(clazzName != null) {
					var model = this.provider.getModelByStringName(clazzName);
					fieldName = model.getSqlColumn(cToken1.getAttributeName());
					if(fieldPrefix == null) {
						var tableName = model.getTableName();
						var schemaName = model.getSchemaName();
						fieldPrefix = this.provider.generateQualifiedName(schemaName,tableName);
					}
				} else fieldName = this.generateId(cToken1.attributeName);
				if(cToken1.getAttributeName() == "*") sqlTranslation += fieldPrefix + ".*"; else sqlTranslation += fieldPrefix + "." + fieldName;
				sqlTranslation += " " + nestedTranslation + " ";
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Where)) sqlTranslation += " WHERE " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Group)) sqlTranslation += " GROUP BY " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.From)) sqlTranslation += " FROM " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.OrderBy)) sqlTranslation += " ORDER BY " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.OrderByItem)) {
				var oToken;
				oToken = js.Boot.__cast(token , saturn.db.query_lang.OrderByItem);
				var direction = "ASC";
				if(oToken.descending) direction = "DESC";
				sqlTranslation += nestedTranslation + " " + direction;
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.ClassToken)) {
				var cToken2;
				cToken2 = js.Boot.__cast(token , saturn.db.query_lang.ClassToken);
				var model1 = this.provider.getModelByStringName(cToken2.getClass());
				var tableName1 = model1.getTableName();
				var schemaName1 = model1.getSchemaName();
				var name = this.provider.generateQualifiedName(schemaName1,tableName1);
				sqlTranslation += " " + name + " ";
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Operator)) {
				if(js.Boot.__instanceof(token,saturn.db.query_lang.And)) sqlTranslation += " AND " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Plus)) sqlTranslation += " + " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Minus)) sqlTranslation += " - " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Or)) sqlTranslation += " OR " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Equals)) sqlTranslation += " = " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.IsNull)) sqlTranslation += " IS NULL " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.IsNotNull)) sqlTranslation += " IS NOT NULL " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.GreaterThan)) sqlTranslation += " > " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.GreaterThanOrEqualTo)) sqlTranslation += " >= " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.LessThan)) sqlTranslation += " < " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.LessThanOrEqualTo)) sqlTranslation += " <= " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.In)) sqlTranslation += " IN " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Concat)) sqlTranslation += " || " + nestedTranslation; else if(js.Boot.__instanceof(token,saturn.db.query_lang.Like)) sqlTranslation += " LIKE " + nestedTranslation;
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.ValueList)) {
				var cToken3;
				cToken3 = js.Boot.__cast(token , saturn.db.query_lang.ValueList);
				var values = cToken3.getValues();
				var itemStrings = [];
				var _g12 = 0;
				var _g4 = values.length;
				while(_g12 < _g4) {
					var i = _g12++;
					itemStrings.push(this.getParameterNotation(this.valPos++));
					values.push(values[i]);
				}
				sqlTranslation += " ( " + itemStrings.join(",") + " ) ";
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.Limit)) {
				var cToken4;
				cToken4 = js.Boot.__cast(token , saturn.db.query_lang.Limit);
				sqlTranslation += this.getLimitClause(nestedTranslation);
			} else if(js.Boot.__instanceof(token,saturn.db.query_lang.StartBlock)) sqlTranslation += " ( "; else if(js.Boot.__instanceof(token,saturn.db.query_lang.EndBlock)) sqlTranslation += " ) "; else sqlTranslation += " " + nestedTranslation + " ";
		}
		if(token != null && token.name != null && !js.Boot.__instanceof(token,saturn.db.query_lang.Query)) {
			var generatedAlias1 = this.generateId(token.name);
			sqlTranslation += "  \"" + generatedAlias1 + "\"";
		}
		return sqlTranslation;
	}
	,getProcessedResults: function(results) {
		if(results.length > 0) {
			this.generatedToAlias = new haxe.ds.StringMap();
			var $it0 = this.aliasToGenerated.keys();
			while( $it0.hasNext() ) {
				var generated = $it0.next();
				var key = this.aliasToGenerated.get(generated);
				this.generatedToAlias.set(key,generated);
			}
			var fields = Reflect.fields(results[0]);
			var toRename = [];
			var _g = 0;
			while(_g < fields.length) {
				var field = fields[_g];
				++_g;
				if(this.generatedToAlias.exists(field)) toRename.push(field);
			}
			if(toRename.length > 0) {
				var _g1 = 0;
				while(_g1 < results.length) {
					var row = results[_g1];
					++_g1;
					var _g11 = 0;
					while(_g11 < toRename.length) {
						var field1 = toRename[_g11];
						++_g11;
						var val = Reflect.field(row,field1);
						Reflect.deleteField(row,field1);
						Reflect.setField(row,this.generatedToAlias.get(field1),val);
					}
				}
			}
		}
		return results;
	}
	,getParameterNotation: function(i) {
		if(this.provider.getProviderType() == "ORACLE") return ":" + i; else if(this.provider.getProviderType() == "MYSQL") return "?"; else if(this.provider.getProviderType() == "PGSQL") return "$" + i; else return "?";
	}
	,postProcess: function(query) {
		if(this.provider.getProviderType() == "ORACLE") {
			if(query.tokens != null && query.tokens.length > 0) {
				var _g = 0;
				var _g1 = query.tokens;
				while(_g < _g1.length) {
					var token = _g1[_g];
					++_g;
					if(js.Boot.__instanceof(token,saturn.db.query_lang.Limit)) {
						if(query.whereToken == null) query.whereToken = new saturn.db.query_lang.Where();
						var where = query.getWhere();
						where.add(token);
						HxOverrides.remove(query.tokens,token);
					}
				}
			}
		}
	}
	,getLimitClause: function(txt) {
		if(this.provider.getProviderType() == "ORACLE") return " ROWNUM < " + txt; else if(this.provider.getProviderType() == "MYSQL") return " limit " + txt; else if(this.provider.getProviderType() == "PGSQL") return " LIMIT " + txt; else return " limit " + txt;
	}
	,buildSqlInClause: function(numIds,nextVal,func) {
		if(nextVal == null) nextVal = 0;
		var inClause_b = "";
		inClause_b += "IN(";
		inClause_b += ")";
		return inClause_b;
	}
	,__class__: saturn.db.query_lang.SQLVisitor
};
saturn.db.query_lang.Select = $hxClasses["saturn.db.query_lang.Select"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.Select.__name__ = ["saturn","db","query_lang","Select"];
saturn.db.query_lang.Select.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Select.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Select
});
saturn.db.query_lang.StartBlock = $hxClasses["saturn.db.query_lang.StartBlock"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.StartBlock.__name__ = ["saturn","db","query_lang","StartBlock"];
saturn.db.query_lang.StartBlock.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.StartBlock.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.StartBlock
});
saturn.db.query_lang.Substr = $hxClasses["saturn.db.query_lang.Substr"] = function(value,position,length) {
	saturn.db.query_lang.Function.call(this,[value,position,length]);
};
saturn.db.query_lang.Substr.__name__ = ["saturn","db","query_lang","Substr"];
saturn.db.query_lang.Substr.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Substr.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Substr
});
saturn.db.query_lang.Trim = $hxClasses["saturn.db.query_lang.Trim"] = function(value) {
	saturn.db.query_lang.Function.call(this,[value]);
};
saturn.db.query_lang.Trim.__name__ = ["saturn","db","query_lang","Trim"];
saturn.db.query_lang.Trim.__super__ = saturn.db.query_lang.Function;
saturn.db.query_lang.Trim.prototype = $extend(saturn.db.query_lang.Function.prototype,{
	__class__: saturn.db.query_lang.Trim
});
saturn.db.query_lang.Value = $hxClasses["saturn.db.query_lang.Value"] = function(value) {
	saturn.db.query_lang.Token.call(this,null);
	this.value = value;
};
saturn.db.query_lang.Value.__name__ = ["saturn","db","query_lang","Value"];
saturn.db.query_lang.Value.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Value.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	value: null
	,getValue: function() {
		return this.value;
	}
	,__class__: saturn.db.query_lang.Value
});
saturn.db.query_lang.ValueList = $hxClasses["saturn.db.query_lang.ValueList"] = function(values) {
	this.values = values;
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.ValueList.__name__ = ["saturn","db","query_lang","ValueList"];
saturn.db.query_lang.ValueList.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.ValueList.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	values: null
	,getValues: function() {
		return this.values;
	}
	,__class__: saturn.db.query_lang.ValueList
});
saturn.db.query_lang.Where = $hxClasses["saturn.db.query_lang.Where"] = function() {
	saturn.db.query_lang.Token.call(this,null);
};
saturn.db.query_lang.Where.__name__ = ["saturn","db","query_lang","Where"];
saturn.db.query_lang.Where.__super__ = saturn.db.query_lang.Token;
saturn.db.query_lang.Where.prototype = $extend(saturn.db.query_lang.Token.prototype,{
	__class__: saturn.db.query_lang.Where
});
if(!saturn.server) saturn.server = {};
if(!saturn.server.plugins) saturn.server.plugins = {};
if(!saturn.server.plugins.core) saturn.server.plugins.core = {};
saturn.server.plugins.core.AuthenticationManager = $hxClasses["saturn.server.plugins.core.AuthenticationManager"] = function() { };
saturn.server.plugins.core.AuthenticationManager.__name__ = ["saturn","server","plugins","core","AuthenticationManager"];
saturn.server.plugins.core.AuthenticationManager.prototype = {
	authenticate: null
	,__class__: saturn.server.plugins.core.AuthenticationManager
};
saturn.server.plugins.core.BaseServerPlugin = $hxClasses["saturn.server.plugins.core.BaseServerPlugin"] = function(saturn1,config) {
	this.debug = (js.Node.require("debug"))("saturn:plugin");
	this.saturn = saturn1;
	this.config = config;
	this.plugins = [];
	this.processConfig();
	this.registerPlugins();
};
saturn.server.plugins.core.BaseServerPlugin.__name__ = ["saturn","server","plugins","core","BaseServerPlugin"];
saturn.server.plugins.core.BaseServerPlugin.prototype = {
	saturn: null
	,config: null
	,plugins: null
	,debug: null
	,processConfig: function() {
	}
	,registerPlugins: function() {
		var clazzName = Type.getClassName(js.Boot.getClass(this));
		if(Object.prototype.hasOwnProperty.call(this.config,"plugins")) {
			var pluginDefs = Reflect.field(this.config,"plugins");
			var _g = 0;
			while(_g < pluginDefs.length) {
				var pluginDef = pluginDefs[_g];
				++_g;
				var clazzStr = Reflect.field(pluginDef,"clazz");
				var clazz = Type.resolveClass(clazzStr);
				var plugin = Type.createInstance(clazz,[this,pluginDef]);
				this.debug("CHILD_PLUGIN" + Type.getClassName(clazz));
				this.plugins.push(plugin);
			}
		}
	}
	,getSaturnServer: function() {
		return this.saturn;
	}
	,__class__: saturn.server.plugins.core.BaseServerPlugin
};
saturn.server.plugins.core.AuthenticationPlugin = $hxClasses["saturn.server.plugins.core.AuthenticationPlugin"] = function(server,config) {
	saturn.server.plugins.core.BaseServerPlugin.call(this,server,config);
	this.configureAuthenticationManager();
	this.installAuth();
	if(config.password_in_token) this.debug("Warning storing user passwords in tokens is probably a very bad idea!!!!!!!!!!!");
};
saturn.server.plugins.core.AuthenticationPlugin.__name__ = ["saturn","server","plugins","core","AuthenticationPlugin"];
saturn.server.plugins.core.AuthenticationPlugin.__super__ = saturn.server.plugins.core.BaseServerPlugin;
saturn.server.plugins.core.AuthenticationPlugin.prototype = $extend(saturn.server.plugins.core.BaseServerPlugin.prototype,{
	authManager: null
	,installAuth: function() {
		var _g = this;
		var jwt = js.Node.require("jsonwebtoken");
		var uuid = js.Node.require("node-uuid");
		this.saturn.getServer().post("/login",function(req,res,next) {
			var username = req.params.username;
			var password = req.params.password;
			_g.authManager.authenticate(username,password,function(user) {
				user.uuid = uuid.v4();
				user.username = username;
				if(_g.config.password_in_token) {
					saturn.core.Util.debug("Storing password in token!!!!");
					user.password = password;
				}
				var db = _g.saturn.getRedisClient();
				db.set(user.uuid,user.username);
				saturn.core.Util.debug("a");
				var token = jwt.sign(user,_g.config.jwt_secret,{ expiresInMinutes : _g.config.jwt_timeout});
				res.send(200,{ token : token, full_name : user.firstname + " " + user.lastname, email : user.email, 'projects' : user.projects});
				next();
			},function(err) {
				res.send(200,{ error : "Unable to authenticate"});
				next();
			},req.connection.remoteAddress);
		});
		var socketioJwt = js.Node.require("socketio-jwt");
		this.saturn.getServerSocket().on("connection",socketioJwt.authorize({ required : false, secret : this.config.jwt_secret, timeout : 15000, additional_auth : $bind(this,this.additionalAuth)})).on("authenticated",function(socket) {
			socket.on("logout",function(data) {
				_g.saturn.getSocketUser(socket,function(authUser) {
					if(authUser != null) {
						js.Node.console.log("Logging " + authUser.username + " out");
						var db1 = _g.saturn.getRedisClient();
						db1.del(authUser.uuid);
						_g.saturn.setUser(socket,null);
					}
				});
			});
		});
	}
	,configureAuthenticationManager: function() {
		var clazzStr = this.config.authentication_manager.clazz;
		var clazz = Type.resolveClass(clazzStr);
		this.authManager = Type.createInstance(clazz,[this.config.authentication_manager]);
		if(!js.Boot.__instanceof(this.authManager,saturn.server.plugins.core.AuthenticationManager)) throw new js._Boot.HaxeError("Unable to setup authentication manager\n" + clazzStr + " should implement " + Std.string(saturn.server.plugins.core.AuthenticationManager));
	}
	,additionalAuth: function(user,onSuccess,onFailure) {
		var _g = this;
		js.Node.console.log("Validating jwt token is current");
		var db = this.saturn.getRedisClient();
		this.debug("Got redis");
		this.saturn.isUserAuthenticated(user,function(authUser) {
			_g.debug("here");
			if(authUser != null) onSuccess(); else {
				_g.debug("Returning failure");
				onFailure("On Error","invalid_token");
			}
		});
	}
	,__class__: saturn.server.plugins.core.AuthenticationPlugin
});
saturn.server.plugins.core.ConfigurationPlugin = $hxClasses["saturn.server.plugins.core.ConfigurationPlugin"] = function() { };
saturn.server.plugins.core.ConfigurationPlugin.__name__ = ["saturn","server","plugins","core","ConfigurationPlugin"];
saturn.server.plugins.core.ConfigurationPlugin.getConfiguration = function(query,params,clazz,cb,hookConfig) {
	saturn.core.Util.debug("Returning configuration");
	if(hookConfig == null) cb(null,"Hook configuration is missing"); else if(Object.prototype.hasOwnProperty.call(hookConfig,"config")) cb(Reflect.field(hookConfig,"config"),null); else cb(null,"ConfigurationPlugin configuration block is missing config attribute from JSON");
};
saturn.server.plugins.core.DefaultProviderPlugin = $hxClasses["saturn.server.plugins.core.DefaultProviderPlugin"] = function(server,config) {
	saturn.server.plugins.core.BaseServerPlugin.call(this,server,config);
	this.configureProviders();
};
saturn.server.plugins.core.DefaultProviderPlugin.__name__ = ["saturn","server","plugins","core","DefaultProviderPlugin"];
saturn.server.plugins.core.DefaultProviderPlugin.__super__ = saturn.server.plugins.core.BaseServerPlugin;
saturn.server.plugins.core.DefaultProviderPlugin.prototype = $extend(saturn.server.plugins.core.BaseServerPlugin.prototype,{
	configureProviders: function() {
		var connections = this.config.connections;
		var _g = 0;
		while(_g < connections.length) {
			var connection = connections[_g];
			++_g;
			this._configureProvider(connection);
		}
	}
	,configureProviderold: function() {
		var _g = this;
		var driver = this.config.connection.driver;
		var clazz = null;
		try {
			clazz = Type.resolveClass(driver);
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			js.Node.console.log(e);
			js.Node.process.exit(-1);
		}
		var models = null;
		try {
			models = Type.createInstance(Type.resolveClass(this.config.connection.model_mapping),[]).models;
			this.debug("Hello World");
		} catch( e1 ) {
			if (e1 instanceof js._Boot.HaxeError) e1 = e1.val;
			js.Node.console.log(e1);
			js.Node.process.exit(-1);
		}
		if(this.config.connection.use_pool) {
			var pool = saturn.db.NodePool.generatePool("main_db",3,3,2000000,true,function(cb) {
				_g.debug("Configuring provider");
				var provider = Type.createInstance(clazz,[models,_g.config.connection,false]);
				provider.dataBinding(false);
				provider.readModels(function(err) {
					cb(err,provider);
					_g.debug(err);
				});
				provider.enableCache(false);
			},function(resource) {
			});
			saturn.client.core.CommonCore.setPool(this.config.name,pool,this.config.default_provider);
		} else {
			this.debug("Configuring provider");
			var provider1 = Type.createInstance(clazz,[models,this.config.connection,false]);
			provider1.enableCache(false);
			provider1.dataBinding(false);
			provider1.readModels(function(err1) {
				if(err1 != null) {
					_g.debug(err1);
					js.Node.process.exit(-1);
				}
			});
			saturn.client.core.CommonCore.setDefaultProvider(provider1,this.config.name,this.config.default_provider);
		}
	}
	,_configureProvider: function(config) {
		var _g = this;
		var driver = config.driver;
		var clazz = null;
		try {
			clazz = Type.resolveClass(driver);
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			js.Node.console.log(e);
			js.Node.process.exit(-1);
		}
		var models = null;
		try {
			models = Type.createInstance(Type.resolveClass(config.model_mapping),[]).models;
			this.debug("Hello World " + config.model_mapping);
		} catch( e1 ) {
			if (e1 instanceof js._Boot.HaxeError) e1 = e1.val;
			js.Node.console.log(e1);
			js.Node.process.exit(-1);
		}
		if(config.use_pool) {
			var pool = saturn.db.NodePool.generatePool("main_db",3,3,2000000,true,function(cb) {
				_g.debug("Configuring provider");
				var provider = Type.createInstance(clazz,[models,config,false]);
				provider.dataBinding(false);
				provider.setName(config.name);
				provider.readModels(function(err) {
					cb(err,provider);
					_g.debug(err);
				});
				provider.enableCache(false);
			},function(resource) {
			});
			saturn.client.core.CommonCore.setPool(config.name,pool,config.default_provider);
		} else {
			this.debug("Configuring provider");
			var provider1 = Type.createInstance(clazz,[models,config,false]);
			provider1.enableCache(false);
			provider1.dataBinding(false);
			provider1.setName(config.name);
			provider1.readModels(function(err1) {
				if(err1 != null) {
					_g.debug(err1);
					js.Node.process.exit(-1);
				}
			});
			saturn.client.core.CommonCore.setDefaultProvider(provider1,config.name,config.default_provider);
		}
	}
	,__class__: saturn.server.plugins.core.DefaultProviderPlugin
});
saturn.server.plugins.core.ExternalAuthenticationPlugin = $hxClasses["saturn.server.plugins.core.ExternalAuthenticationPlugin"] = function(config) {
	this.config = config;
};
saturn.server.plugins.core.ExternalAuthenticationPlugin.__name__ = ["saturn","server","plugins","core","ExternalAuthenticationPlugin"];
saturn.server.plugins.core.ExternalAuthenticationPlugin.__interfaces__ = [saturn.server.plugins.core.AuthenticationManager];
saturn.server.plugins.core.ExternalAuthenticationPlugin.prototype = {
	config: null
	,authenticate: function(username,password,onSuccess,onFailure,src) {
		var hookConfig = this.config.external_hook;
		var authObj = [{ 'username' : username, 'password' : password, 'mode' : "authenticate", 'src' : src}];
		saturn.db.provider.hooks.ExternalJsonHook.run("Authenticate",authObj,null,function(objs,error) {
			if(error != null) {
				saturn.core.Util.debug(error);
				onFailure("Internal server error");
			} else {
				saturn.core.Util.debug("Authentication manager returned");
				var authResponse = objs[0];
				if(authResponse.outcome == "success") {
					var user = new saturn.core.User();
					user.firstname = authResponse.firstName;
					user.lastname = authResponse.lastName;
					user.email = authResponse.email;
					user.projects = authResponse.projects;
					saturn.core.Util.debug("Returning success");
					onSuccess(user);
				} else {
					saturn.core.Util.debug("Returning error");
					onFailure("Unable to authenticate");
				}
			}
		},hookConfig);
	}
	,__class__: saturn.server.plugins.core.ExternalAuthenticationPlugin
};
saturn.server.plugins.core.MySQLAuthPlugin = $hxClasses["saturn.server.plugins.core.MySQLAuthPlugin"] = function(config) {
	this.config = config;
};
saturn.server.plugins.core.MySQLAuthPlugin.__name__ = ["saturn","server","plugins","core","MySQLAuthPlugin"];
saturn.server.plugins.core.MySQLAuthPlugin.__interfaces__ = [saturn.server.plugins.core.AuthenticationManager];
saturn.server.plugins.core.MySQLAuthPlugin.prototype = {
	config: null
	,authenticate: function(username,password,onSuccess,onFailure,src) {
		var mysql = js.Node.require("mysql2");
		var connection = mysql.createConnection({ host : this.config.hostname, user : username, password : password, database : username});
		connection.on("connect",function(connect) {
			if(connect) connection.query("\r\n                    SELECT\r\n                     *\r\n                    FROM\r\n                        icmdb_page_secure.V_USERS\r\n                    WHERE\r\n                        Name=?\r\n                ",[username],function(err,res) {
				if(err) {
					js.Node.console.log("Error connecting");
					onFailure("Unable to connect");
				} else {
					js.Node.console.log("Success");
					if(res.length == 0) {
						js.Node.console.log("Unable to connect");
						onFailure("Unable to connect");
					} else {
						var userRow = res[0];
						var user = new saturn.core.User();
						user.firstname = userRow.First_Name;
						user.lastname = userRow.Last_Name;
						user.email = userRow.EMail;
						js.Node.console.log("Login succeded!");
						onSuccess(user);
					}
				}
				connection.end();
			}); else {
				js.Node.console.log("Unable to connect");
				onFailure("Unable to connect");
			}
		});
		connection.on("error",function(err1) {
			js.Node.console.log("Error: " + (err1 == null?"null":"" + err1));
			onFailure("Unable to connect");
			connection.end();
		});
	}
	,__class__: saturn.server.plugins.core.MySQLAuthPlugin
};
saturn.server.plugins.core.ProxyPlugin = $hxClasses["saturn.server.plugins.core.ProxyPlugin"] = function(server,config) {
	saturn.server.plugins.core.BaseServerPlugin.call(this,server,config);
	this.configure();
};
saturn.server.plugins.core.ProxyPlugin.__name__ = ["saturn","server","plugins","core","ProxyPlugin"];
saturn.server.plugins.core.ProxyPlugin.__super__ = saturn.server.plugins.core.BaseServerPlugin;
saturn.server.plugins.core.ProxyPlugin.prototype = $extend(saturn.server.plugins.core.BaseServerPlugin.prototype,{
	proxy: null
	,configure: function() {
		var _g2 = this;
		var httpProxy = js.Node.require("http-proxy");
		var Agent = js.Node.require("agentkeepalive");
		var agent = new Agent({
            maxSockets: 100,
            keepAlive: true,
            maxFreeSockets: 20,
            keepAliveMsecs:100000,
            timeout: 600000,
            keepAliveTimeout: 300000 // free socket keepalive for 30 seconds
        });
		this.proxy = httpProxy.createProxyServer({ agent : agent});
		var server = this.getSaturnServer().getServer();
		var restify = js.Node.require("restify");
		server["use"](this.wrapMiddleware(restify.plugins.bodyParser({ mapParams : true})));
		var _g = 0;
		var _g1 = Reflect.fields(this.config.routes);
		while(_g < _g1.length) {
			var route = _g1[_g];
			++_g;
			var routeConfig = [Reflect.field(this.config.routes,route)];
			this.debug("Routing " + route + " to " + routeConfig[0].target);
			if(routeConfig[0].GET) {
				this.debug("Adding GET proxy");
				server.get(route,(function(routeConfig) {
					return function(req,res) {
						_g2.debug("Request: " + req.getPath());
						_g2.proxyRequest(req,res,routeConfig[0].target);
					};
				})(routeConfig));
			}
			if(routeConfig[0].POST) {
				this.debug("Adding POST proxy");
				server.post(route,(function(routeConfig) {
					return function(req1,res1) {
						_g2.proxyRequest(req1,res1,routeConfig[0].target);
					};
				})(routeConfig));
			}
		}
		this.proxy.on("error",function(error,req2,res2) {
			var json;
			_g2.debug("proxy error",error);
			if(!res2.headersSent) res2.writeHead(500,{ 'content-type' : "application/json"});
			json = { error : "proxy_error", reason : error.message};
			res2.end(haxe.Json.stringify(json,null,null));
		});
	}
	,proxyRequest: function(req,res,target) {
		this.proxy.web(req,res,{ target : target});
	}
	,wrapMiddleware: function(middleware) {
		return function(req,res,next) {
			if(StringTools.startsWith(req.path(),"/GlycanBuilder")) next(); else if((middleware instanceof Array) && middleware.__enum__ == null) middleware[0](req,res,function() {
				middleware[1](req,res,next);
			}); else middleware(req,res,next);
		};
	}
	,__class__: saturn.server.plugins.core.ProxyPlugin
});
saturn.server.plugins.core.SocketPlugin = $hxClasses["saturn.server.plugins.core.SocketPlugin"] = function(server,config) {
	saturn.server.plugins.core.BaseServerPlugin.call(this,server,config);
	this.startSocketServer();
};
saturn.server.plugins.core.SocketPlugin.__name__ = ["saturn","server","plugins","core","SocketPlugin"];
saturn.server.plugins.core.SocketPlugin.__super__ = saturn.server.plugins.core.BaseServerPlugin;
saturn.server.plugins.core.SocketPlugin.prototype = $extend(saturn.server.plugins.core.BaseServerPlugin.prototype,{
	startSocketServer: function() {
		var socket = js.Node.require("socket.io").listen(this.saturn.getServer().server,{ log : true});
		socket.set("origins",this.saturn.getServerConfig().origins);
		socket.set("transports",["websocket","polling"]);
		this.saturn.setServerSocket(socket);
	}
	,__class__: saturn.server.plugins.core.SocketPlugin
});
if(!saturn.server.plugins.socket) saturn.server.plugins.socket = {};
if(!saturn.server.plugins.socket.core) saturn.server.plugins.socket.core = {};
saturn.server.plugins.socket.core.BaseServerSocketPlugin = $hxClasses["saturn.server.plugins.socket.core.BaseServerSocketPlugin"] = function(server,config) {
	this.authenticateAll = false;
	this.pluginName = Type.getClassName(js.Boot.getClass(this));
	this.messageToCB = new haxe.ds.StringMap();
	this.debug = (js.Node.require("debug"))("saturn:socket-plugin");
	saturn.server.plugins.core.BaseServerPlugin.call(this,server,config);
};
saturn.server.plugins.socket.core.BaseServerSocketPlugin.__name__ = ["saturn","server","plugins","socket","core","BaseServerSocketPlugin"];
saturn.server.plugins.socket.core.BaseServerSocketPlugin.__super__ = saturn.server.plugins.core.BaseServerPlugin;
saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype = $extend(saturn.server.plugins.core.BaseServerPlugin.prototype,{
	queueName: null
	,queue: null
	,messageToCB: null
	,pluginName: null
	,authenticateAll: null
	,processConfig: function() {
		saturn.server.plugins.core.BaseServerPlugin.prototype.processConfig.call(this);
		if(Object.prototype.hasOwnProperty.call(this.config,"authentication")) {
			if(Object.prototype.hasOwnProperty.call(this.config.authentication,"*")) {
				this.debug("(AUTH_ALL)");
				this.authenticateAll = true;
			}
		}
	}
	,registerPlugins: function() {
		if(!Object.prototype.hasOwnProperty.call(this.config,"authentication")) this.config.authentication = [];
		if(Object.prototype.hasOwnProperty.call(this.config,"plugins")) {
			var pluginDefs = Reflect.field(this.config,"plugins");
			var _g = 0;
			while(_g < pluginDefs.length) {
				var pluginDef = pluginDefs[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(pluginDef,"authentication")) {
					var fields = Reflect.fields(pluginDef.authentication);
					var _g1 = 0;
					while(_g1 < fields.length) {
						var field = fields[_g1];
						++_g1;
						this.debug("CHILD_PLUGIN_AUTH:" + field);
						Reflect.setField(this.config.authentication,field,Reflect.field(pluginDef.authentication,field));
					}
				}
			}
		}
		saturn.server.plugins.core.BaseServerPlugin.prototype.registerPlugins.call(this);
	}
	,addListeners: function(socket) {
		var _g = this;
		var $it0 = this.messageToCB.keys();
		while( $it0.hasNext() ) {
			var message = $it0.next();
			var message1 = [message];
			socket.on(message1[0],(function(message1) {
				return function(data) {
					var handler = _g.messageToCB.get(message1[0]);
					data.socketId = socket.id;
					handler(data,socket);
				};
			})(message1));
		}
	}
	,cleanup: function(data) {
	}
	,registerListener: function(message,cb) {
		var _g = this;
		var paths = [Type.getClassName(js.Boot.getClass(this))];
		if(Object.prototype.hasOwnProperty.call(this.config,"namespaces")) {
			var namespace_defs = this.config.namespaces;
			var _g1 = 0;
			while(_g1 < namespace_defs.length) {
				var namespace_def = namespace_defs[_g1];
				++_g1;
				paths.push(namespace_def.name);
			}
		}
		var wrapperCb = cb;
		var auth = this.authenticateAll;
		if(!auth) {
			if(Object.prototype.hasOwnProperty.call(this.config,"authentication")) {
				if(Object.prototype.hasOwnProperty.call(this.config.authentication,message)) auth = true;
			}
		}
		if(auth) {
			this.debug("AUTH_REQUIRED: " + message);
			wrapperCb = function(obj,socket) {
				if(message == "_data_request_objects_namedquery") {
					_g.debug("Checking named query");
					if(Object.prototype.hasOwnProperty.call(_g.config.authentication,message)) {
						var messageConfig = Reflect.field(_g.config.authentication,message);
						var namedQueryConfigs = Reflect.field(messageConfig,"queries");
						var namedQuery = Reflect.field(obj,"queryId");
						_g.debug("Checking configuration for " + namedQuery);
						if(Object.prototype.hasOwnProperty.call(namedQueryConfigs,namedQuery)) {
							var namedQueryConfig = Reflect.field(namedQueryConfigs,namedQuery);
							if(Reflect.field(namedQueryConfig,"role") == "PUBLIC") {
								_g.debug("Named query is publically accessible!");
								cb(obj,socket);
								return;
							} else _g.debug("Role is not public");
						} else _g.debug("Missing query configuration");
					} else {
						cb(obj,socket);
						return;
					}
				}
				_g.saturn.isSocketAuthenticated(socket,function(user) {
					if(user != null) {
						_g.debug("User: " + user.username);
						cb(obj,socket);
					} else _g.handleError(obj,"Access denied<br/>Login or acquire additional permissions",null);
				});
			};
		}
		var _g2 = 0;
		while(_g2 < paths.length) {
			var path = paths[_g2];
			++_g2;
			var fqm = path;
			if(message.length > 0) fqm = path + "." + message;
			this.debug("URL: " + fqm);
			this.messageToCB.set(fqm,wrapperCb);
		}
	}
	,sendJson: function(job,json,done) {
		try {
			var jobId = this.getJobId(job);
			var response = { };
			this.debug("JSON Error: " + Std.string(json.error));
			if(json.error != null) {
				json.error = StringTools.replace(Std.string(json.error),"\n","");
				response.error = json.error;
			}
			response.bioinfJobId = jobId;
			response.json = json;
			response.msgId = jobId;
			var socket = this.getSocket(job);
			if(socket != null) {
				socket.emit("__response__",response);
				this.cleanup(job);
			} else this.debug("Unknown destination for " + jobId);
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			if( js.Boot.__instanceof(e,saturn.server.plugins.socket.core.SocketIOException) ) {
				console.log(e.toString());
			} else throw(e);
		}
		if(done != null) done();
	}
	,sendError: function(job,error,done) {
		try {
			var jobId = this.getJobId(job);
			this.debug("Error: " + error);
			var socket = this.getSocket(job);
			if(socket != null) {
				socket.emit(this.pluginName + ":response",{ bioinfJobId : jobId, error : error, msgId : jobId});
				socket.emit("__response__",{ bioinfJobId : jobId, error : error, msgId : jobId});
			} else this.debug("Unknown destination for " + jobId);
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			if( js.Boot.__instanceof(e,saturn.server.plugins.socket.core.SocketIOException) ) {
				console.log(e.toString());
			} else throw(e);
		}
		if(done != null) done();
		this.cleanup(job);
	}
	,broadcast: function(msg,json) {
		this.debug("Broadcasting message:" + msg);
		this.saturn.getServerSocket().sockets.emit(msg,json);
	}
	,registerCommand: function(command,handler) {
		this.registerListener(command,handler);
	}
	,handleError: function(job,error,cb) {
		this.debug(error);
		if(cb != null) cb();
		try {
			var socket = this.getSocket(job);
			var jobId = this.getJobId(job);
			if(socket != null) {
				var errorObj = error;
				if(Object.prototype.hasOwnProperty.call(error,"message")) socket.emit("receiveError",{ msgId : jobId, bioinfJobId : jobId, error : error, JOB_DONE : 1}); else socket.emit("receiveError",{ msgId : jobId, bioinfJobId : jobId, error : haxe.Json.stringify(error,null,null), JOB_DONE : 1});
			} else this.debug("Unable to identify socket associated with job " + jobId + "\nError: " + Std.string(error));
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			if( js.Boot.__instanceof(e,saturn.server.plugins.socket.core.SocketIOException) ) {
				console.log(e.toString());
			} else throw(e);
		}
	}
	,getJobId: function(data) {
		var jobId;
		if(Object.prototype.hasOwnProperty.call(data,"data")) {
			if(Object.prototype.hasOwnProperty.call(data.data,"bioinfJobId")) jobId = data.data.bioinfJobId; else if(Object.prototype.hasOwnProperty.call(data.data,"msgId")) jobId = data.data.msgId; else return "-1";
		} else if(Object.prototype.hasOwnProperty.call(data,"bioinfJobId")) jobId = data.bioinfJobId; else if(Object.prototype.hasOwnProperty.call(data,"msgId")) jobId = data.msgId; else return "-1";
		return jobId;
	}
	,getSocket: function(data) {
		if(Object.prototype.hasOwnProperty.call(data,"data")) {
			if(Object.prototype.hasOwnProperty.call(data.data,"socketId")) return this.saturn.getServerSocket().sockets.connected[data.data.socketId]; else throw new js._Boot.HaxeError(new saturn.server.plugins.socket.core.SocketIOException("Socket ID field missing from job"));
		} else if(Object.prototype.hasOwnProperty.call(data,"socketId")) return this.saturn.getServerSocket().sockets.connected[data.socketId]; else throw new js._Boot.HaxeError(new saturn.server.plugins.socket.core.SocketIOException("Socket ID field missing from job"));
	}
	,getSocketUserNoAuthCheck: function(socket) {
		return this.saturn.getSocketUserNoAuthCheck(socket);
	}
	,__class__: saturn.server.plugins.socket.core.BaseServerSocketPlugin
});
saturn.server.plugins.socket.QueuePlugin = $hxClasses["saturn.server.plugins.socket.QueuePlugin"] = function(server,config) {
	var _g = this;
	saturn.server.plugins.socket.core.BaseServerSocketPlugin.call(this,server,config);
	this.queueName = this.pluginName;
	var Queue = js.Node.require("bull");
	this.queue = Queue(this.queueName,"redis://" + this.saturn.getHostname() + ":" + this.saturn.getRedisPort());
	this.debug("QUEUE: " + this.queueName);
	this.registerListener("",$bind(this,this.onRequest));
	this.queue.process(function(job,done) {
		_g.processRequest(job,done,function() {
		});
	});
	this.queue.on("failed",function(job1,error) {
		_g.handleError(job1,error);
	});
};
saturn.server.plugins.socket.QueuePlugin.__name__ = ["saturn","server","plugins","socket","QueuePlugin"];
saturn.server.plugins.socket.QueuePlugin.__super__ = saturn.server.plugins.socket.core.BaseServerSocketPlugin;
saturn.server.plugins.socket.QueuePlugin.prototype = $extend(saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype,{
	onRequest: function(data,socket) {
		if(Object.prototype.hasOwnProperty.call(data,"bioinfJobId") || Object.prototype.hasOwnProperty.call(data,"msgId")) {
			data.socketId = socket.id;
			this.queue.add(data);
		} else socket.emit("receiveError",{ error : "Invalid request, missing bioinfJobId field"});
	}
	,processRequest: function(job,done,cb) {
	}
	,handleError: function(job,error,done) {
		saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype.handleError.call(this,job,error,done);
	}
	,__class__: saturn.server.plugins.socket.QueuePlugin
});
saturn.server.plugins.socket.ABIConverter = $hxClasses["saturn.server.plugins.socket.ABIConverter"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.ABIConverter.__name__ = ["saturn","server","plugins","socket","ABIConverter"];
saturn.server.plugins.socket.ABIConverter.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.ABIConverter.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		this.runConverter(job,done,cb);
	}
	,runConverter: function(job,done,__return) {
		var _g = this;
		(function(binaryData) {
			binaryData;
			(function(__afterVar_169) {
				bindings.NodeTemp.open("abi_conversion_",function(__parameter_170,__parameter_171) {
					__afterVar_169(__parameter_170,__parameter_171);
				});
			})(function(err,binary_info) {
				err;
				binary_info;
				var __wrapper_30 = function() {
					(function(__afterVar_172) {
						js.Node.require("fs").writeFile(binary_info.path,binaryData,function(__parameter_173) {
							__afterVar_172(__parameter_173);
						});
					})(function(err1) {
						err1;
						var __wrapper_31 = function() {
							return (function(__afterVar_174) {
								bindings.NodeTemp.open("abi_conversion_json_",function(__parameter_175,__parameter_176) {
									__afterVar_174(__parameter_175,__parameter_176);
								});
							})(function(err2,json_info) {
								err2;
								json_info;
								var __wrapper_32 = function() {
									return (function(nodePath) {
										nodePath;
										(function(progName) {
											progName;
											(function(args) {
												args;
												(function(args1) {
													args1;
													var __wrapper_33 = function() {
														return (function(proc) {
															proc;
															proc.stderr.on("data",function(error) {
															});
															proc.stdout.on("data",function(error1) {
															});
															(function(__afterVar_182) {
																proc.on("close",function(__parameter_183) {
																	__afterVar_182(__parameter_183);
																});
															})(function(code) {
																code;
																if(code == "0") {
																	js.Node.console.info("ABI parse complete");
																	(function(__afterVar_184) {
																		js.Node.require("fs").readFile(json_info.path + "_pruned_data.json","utf8",function(__parameter_185,__parameter_186) {
																			__afterVar_184(__parameter_185,__parameter_186);
																		});
																	})(function(err3,data) {
																		err3;
																		data;
																		if(err3 != null) {
																			_g.handleError(job,err3,done);
																			__return();
																		} else {
																			js.Node.console.info("Sending ABI JSON");
																			_g.sendJson(job,data,done);
																			__return();
																		}
																	});
																} else {
																	_g.handleError(job,"An unexpected exception has occurred (" + _g.saturn.getStandardErrorCode() + ")",done);
																	__return();
																}
															});
														})(js.Node.require("child_process").spawn(progName,args1));
													};
													if(js.Node.require("os").platform() == "win32") {
														progName = "bin/deployed_bin/ABIConverter.exe";
														args1 = [binary_info.path,json_info.path];
														__wrapper_33();
													} else __wrapper_33();
												})([]);
											})(["bin/deployed_bin/ABIConverter.py",binary_info.path,json_info.path]);
										})(_g.saturn.getPythonPath());
									})(js.Node.require("path").dirname(__filename));
								};
								if(err2 != null) {
									_g.handleError(job,err2,done);
									__return();
								} else __wrapper_32();
							});
						};
						if(err1 != null) {
							_g.handleError(job,err1,done);
							__return();
						} else __wrapper_31();
					});
					return;
				};
				if(err != null) {
					_g.handleError(job,err,done);
					__return();
				} else __wrapper_30();
			});
		})(new Buffer(job.data.abiFile,"base64"));
	}
	,__class__: saturn.server.plugins.socket.ABIConverter
});
saturn.server.plugins.socket.BLASTDBUpdater = $hxClasses["saturn.server.plugins.socket.BLASTDBUpdater"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.BLASTDBUpdater.__name__ = ["saturn","server","plugins","socket","BLASTDBUpdater"];
saturn.server.plugins.socket.BLASTDBUpdater.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.BLASTDBUpdater.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		var _g11 = this;
		saturn.client.core.CommonCore.getDefaultProvider(function(err,provider) {
			var database = job.data.database;
			var idField = null;
			var sequenceColumn = null;
			var tableName = null;
			var clazz = null;
			var dbType = null;
			var databasePath = null;
			var model = null;
			var databases;
			var _g = new haxe.ds.StringMap();
			var value;
			var _g1 = new haxe.ds.StringMap();
			_g1.set("clazz",saturn.core.domain.SgcConstruct);
			if(__map_reserved.type != null) _g1.setReserved("type","prot"); else _g1.h["type"] = "prot";
			if(__map_reserved.sequenceAttribute != null) _g1.setReserved("sequenceAttribute","proteinSeq"); else _g1.h["sequenceAttribute"] = "proteinSeq";
			if(__map_reserved.databasePath != null) _g1.setReserved("databasePath","databases/constructs_protein.fasta"); else _g1.h["databasePath"] = "databases/constructs_protein.fasta";
			value = _g1;
			if(__map_reserved.construct_protein != null) _g.setReserved("construct_protein",value); else _g.h["construct_protein"] = value;
			var value1;
			var _g2 = new haxe.ds.StringMap();
			_g2.set("clazz",saturn.core.domain.SgcConstruct);
			if(__map_reserved.type != null) _g2.setReserved("type","prot"); else _g2.h["type"] = "prot";
			if(__map_reserved.sequenceAttribute != null) _g2.setReserved("sequenceAttribute","proteinSeqNoTag"); else _g2.h["sequenceAttribute"] = "proteinSeqNoTag";
			if(__map_reserved.databasePath != null) _g2.setReserved("databasePath","databases/constructs_protein_no_tag.fasta"); else _g2.h["databasePath"] = "databases/constructs_protein_no_tag.fasta";
			value1 = _g2;
			if(__map_reserved.construct_protein_no_tag != null) _g.setReserved("construct_protein_no_tag",value1); else _g.h["construct_protein_no_tag"] = value1;
			var value2;
			var _g3 = new haxe.ds.StringMap();
			_g3.set("clazz",saturn.core.domain.SgcConstruct);
			if(__map_reserved.type != null) _g3.setReserved("type","nucl"); else _g3.h["type"] = "nucl";
			if(__map_reserved.sequenceAttribute != null) _g3.setReserved("sequenceAttribute","dnaSeq"); else _g3.h["sequenceAttribute"] = "dnaSeq";
			if(__map_reserved.databasePath != null) _g3.setReserved("databasePath","databases/constructs_nucleotide.fasta"); else _g3.h["databasePath"] = "databases/constructs_nucleotide.fasta";
			value2 = _g3;
			if(__map_reserved.construct_nucleotide != null) _g.setReserved("construct_nucleotide",value2); else _g.h["construct_nucleotide"] = value2;
			var value3;
			var _g4 = new haxe.ds.StringMap();
			_g4.set("clazz",saturn.core.domain.SgcAllele);
			if(__map_reserved.type != null) _g4.setReserved("type","nucl"); else _g4.h["type"] = "nucl";
			if(__map_reserved.sequenceAttribute != null) _g4.setReserved("sequenceAttribute","dnaSeq"); else _g4.h["sequenceAttribute"] = "dnaSeq";
			if(__map_reserved.databasePath != null) _g4.setReserved("databasePath","databases/alleles_nucleotide.fasta"); else _g4.h["databasePath"] = "databases/alleles_nucleotide.fasta";
			value3 = _g4;
			if(__map_reserved.allele_nucleotide != null) _g.setReserved("allele_nucleotide",value3); else _g.h["allele_nucleotide"] = value3;
			var value4;
			var _g5 = new haxe.ds.StringMap();
			_g5.set("clazz",saturn.core.domain.SgcAllele);
			if(__map_reserved.type != null) _g5.setReserved("type","prot"); else _g5.h["type"] = "prot";
			if(__map_reserved.sequenceAttribute != null) _g5.setReserved("sequenceAttribute","proteinSeq"); else _g5.h["sequenceAttribute"] = "proteinSeq";
			if(__map_reserved.databasePath != null) _g5.setReserved("databasePath","databases/alleles_protein.fasta"); else _g5.h["databasePath"] = "databases/alleles_protein.fasta";
			value4 = _g5;
			if(__map_reserved.allele_protein != null) _g.setReserved("allele_protein",value4); else _g.h["allele_protein"] = value4;
			var value5;
			var _g6 = new haxe.ds.StringMap();
			_g6.set("clazz",saturn.core.domain.SgcEntryClone);
			if(__map_reserved.type != null) _g6.setReserved("type","prot"); else _g6.h["type"] = "prot";
			if(__map_reserved.sequenceAttribute != null) _g6.setReserved("sequenceAttribute","proteinSeq"); else _g6.h["sequenceAttribute"] = "proteinSeq";
			if(__map_reserved.databasePath != null) _g6.setReserved("databasePath","databases/entryclones_protein.fasta"); else _g6.h["databasePath"] = "databases/entryclones_protein.fasta";
			value5 = _g6;
			if(__map_reserved.entryclone_protein != null) _g.setReserved("entryclone_protein",value5); else _g.h["entryclone_protein"] = value5;
			var value6;
			var _g7 = new haxe.ds.StringMap();
			_g7.set("clazz",saturn.core.domain.SgcEntryClone);
			if(__map_reserved.type != null) _g7.setReserved("type","nucl"); else _g7.h["type"] = "nucl";
			if(__map_reserved.sequenceAttribute != null) _g7.setReserved("sequenceAttribute","dnaSeq"); else _g7.h["sequenceAttribute"] = "dnaSeq";
			if(__map_reserved.databasePath != null) _g7.setReserved("databasePath","databases/entryclones_nucleotide.fasta"); else _g7.h["databasePath"] = "databases/entryclones_nucleotide.fasta";
			value6 = _g7;
			if(__map_reserved.entryclone_nucleotide != null) _g.setReserved("entryclone_nucleotide",value6); else _g.h["entryclone_nucleotide"] = value6;
			var value7;
			var _g8 = new haxe.ds.StringMap();
			_g8.set("clazz",saturn.core.domain.SgcTarget);
			if(__map_reserved.type != null) _g8.setReserved("type","nucl"); else _g8.h["type"] = "nucl";
			if(__map_reserved.sequenceAttribute != null) _g8.setReserved("sequenceAttribute","dnaSeq"); else _g8.h["sequenceAttribute"] = "dnaSeq";
			if(__map_reserved.databasePath != null) _g8.setReserved("databasePath","databases/targets_nucleotide.fasta"); else _g8.h["databasePath"] = "databases/targets_nucleotide.fasta";
			value7 = _g8;
			if(__map_reserved.target_nucleotide != null) _g.setReserved("target_nucleotide",value7); else _g.h["target_nucleotide"] = value7;
			var value8;
			var _g9 = new haxe.ds.StringMap();
			_g9.set("clazz",saturn.core.domain.SgcTarget);
			if(__map_reserved.type != null) _g9.setReserved("type","prot"); else _g9.h["type"] = "prot";
			if(__map_reserved.sequenceAttribute != null) _g9.setReserved("sequenceAttribute","protSeq"); else _g9.h["sequenceAttribute"] = "protSeq";
			if(__map_reserved.databasePath != null) _g9.setReserved("databasePath","databases/targets_nucleotide.fasta"); else _g9.h["databasePath"] = "databases/targets_nucleotide.fasta";
			value8 = _g9;
			if(__map_reserved.target_protein != null) _g.setReserved("target_protein",value8); else _g.h["target_protein"] = value8;
			var value9;
			var _g10 = new haxe.ds.StringMap();
			_g10.set("clazz",saturn.core.domain.SgcVector);
			if(__map_reserved.type != null) _g10.setReserved("type","nucl"); else _g10.h["type"] = "nucl";
			if(__map_reserved.sequenceAttribute != null) _g10.setReserved("sequenceAttribute","sequence"); else _g10.h["sequenceAttribute"] = "sequence";
			if(__map_reserved.databasePath != null) _g10.setReserved("databasePath","databases/vectors_nucleotide.fasta"); else _g10.h["databasePath"] = "databases/vectors_nucleotide.fasta";
			value9 = _g10;
			if(__map_reserved.vector_nucleotide != null) _g.setReserved("vector_nucleotide",value9); else _g.h["vector_nucleotide"] = value9;
			databases = _g;
			if(__map_reserved[database] != null?databases.existsReserved(database):databases.h.hasOwnProperty(database)) {
				var config;
				config = __map_reserved[database] != null?databases.getReserved(database):databases.h[database];
				clazz = __map_reserved.clazz != null?config.getReserved("clazz"):config.h["clazz"];
				model = provider.getModel(clazz);
				dbType = __map_reserved.type != null?config.getReserved("type"):config.h["type"];
				sequenceColumn = model.modelAtrributeToRDBMS(__map_reserved.sequenceAttribute != null?config.getReserved("sequenceAttribute"):config.h["sequenceAttribute"]);
				databasePath = __map_reserved.databasePath != null?config.getReserved("databasePath"):config.h["databasePath"];
			} else {
				_g11.handleError(job,"Database name invalid",done);
				return;
			}
			tableName = model.getTableName();
			idField = model.getFirstKey_rdbms();
			var fs_module = js.Node.require("fs");
			var stream = fs_module.createWriteStream(databasePath,{ flags : "w"});
			provider.getObjects(clazz,function(objects,err1) {
				if(err1 != null) {
					_g11.handleError(job,err1,done);
					return;
				}
				var _g111 = 0;
				while(_g111 < objects.length) {
					var object = objects[_g111];
					++_g111;
					var id = Reflect.field(object,idField);
					var sequence = Reflect.field(object,sequenceColumn);
					if(database == "entryclone_protein") sequence = new saturn.core.DNA(sequence).getFrameTranslation(saturn.core.GeneticCodes.STANDARD,saturn.core.Frame.ONE);
					stream.write(">" + id + "\n" + sequence + "\n");
				}
				stream.on("finish",function() {
					var progName = "bin/deployed_bin/makeblastdb.exe";
					var args = ["-in",databasePath,"-dbtype",dbType];
					var proc = js.Node.require("child_process").spawn(progName,args);
					proc.stderr.on("data",function(error) {
						js.Node.console.log(error.toString());
					});
					proc.stdout.on("data",function(error1) {
						js.Node.console.log(error1.toString());
					});
					proc.on("close",function(code,signal) {
						if(code == "0") {
							js.Node.console.info("BLASTDB update complete");
							if(signal != null) _g11.handleError(job,signal,done); else _g11.sendJson(job,{ },done);
						} else _g11.handleError(job,"An unexpected exception has occurred (" + _g11.saturn.getStandardErrorCode() + ")",done);
					});
				});
				stream.end();
			});
		});
	}
	,__class__: saturn.server.plugins.socket.BLASTDBUpdater
});
saturn.server.plugins.socket.BLASTPlugin = $hxClasses["saturn.server.plugins.socket.BLASTPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
	this.registerListener("database_list",$bind(this,this.sendDatabaseList));
};
saturn.server.plugins.socket.BLASTPlugin.__name__ = ["saturn","server","plugins","socket","BLASTPlugin"];
saturn.server.plugins.socket.BLASTPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.BLASTPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	sendDatabaseList: function(data,socket) {
		var dbList = { 'DNA' : { }, 'PROT' : { }};
		var dbDefs = this.saturn.getServerConfig().commands.sendBlastReport.arguments.BLAST_DB.allowedValues;
		var dbs = Reflect.fields(dbDefs);
		var _g = 0;
		while(_g < dbs.length) {
			var db = dbs[_g];
			++_g;
			var dbObj = Reflect.field(dbDefs,db);
			var type = dbObj.dbtype;
			if(type == "nucl") dbList.DNA[db] = "1"; else dbList.PROT[db] = "1";
		}
		this.sendJson(data,{ dbList : dbList},null);
	}
	,processRequest: function(job,done,cb) {
		this.runBLAST(job,done,cb);
	}
	,runBLAST: function(job,done,__return) {
		var _g = this;
		(function(socket) {
			socket;
			var __wrapper_25 = function() {
				(function(jobId) {
					jobId;
					(function(__afterVar_146) {
						bindings.NodeTemp.open("blastQuery",function(__parameter_147,__parameter_148) {
							__afterVar_146(__parameter_147,__parameter_148);
						});
					})(function(err,info) {
						err;
						info;
						var __wrapper_26 = function() {
							return (function(buffer) {
								buffer;
								(function(__afterVar_150) {
									js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_151) {
										__afterVar_150(__parameter_151);
									});
								})(function(err1) {
									err1;
									var __wrapper_27 = function() {
										return (function(inputFileName) {
											inputFileName;
											(function(outputFileName) {
												outputFileName;
												(function(blastDatabase) {
													blastDatabase;
													(function(fasta) {
														fasta;
														(function(blastSettings) {
															blastSettings;
															(function(args) {
																args;
																(function(entities) {
																	entities;
																	var __wrapper_28 = function() {
																		return (function(proc) {
																			proc;
																			proc.stderr.on("data",function(error) {
																			});
																			proc.stdout.on("data",function(error1) {
																			});
																			(function(__afterVar_160) {
																				proc.on("close",function(__parameter_161) {
																					__afterVar_160(__parameter_161);
																				});
																			})(function(code) {
																				code;
																				if(code == "0") (function(serveFileName) {
																					serveFileName;
																					(function(responseFile) {
																						responseFile;
																						(function(__afterVar_164) {
																							bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_165) {
																								__afterVar_164(__parameter_165);
																							});
																						})(function(err2) {
																							err2;
																							if(err2 != null) {
																								_g.handleError(job,"An error has occurred making the results file available",done);
																								__return();
																							} else (function(socket1) {
																								socket1;
																								if(socket1 != null) {
																									_g.sendJson(job,{ reportFile : responseFile},done);
																									__return();
																								} else {
																									_g.handleError(job,"Unable to locate socket for job: " + jobId,done);
																									__return();
																								}
																							})(_g.getSocket(job));
																						});
																					})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(js.Node.require("path").basename(outputFileName)) + ".html");
																				})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(js.Node.require("path").basename(outputFileName)) + ".html"); else {
																					_g.handleError(job,"BLAST failed",done);
																					__return();
																				}
																			});
																		})(js.Node.require("child_process").spawn("bin/deployed_bin/" + Std.string(blastSettings.prog),args));
																	};
																	if(entities.length > 0) {
																		if(entities[0].getSequence().length < 20) {
																			args.push("-evalue");
																			args.push("100000");
																			args.push("-word_size");
																			args.push("7");
																			var __wrapper_29 = function() {
																				return (function($this) {
																					var $r;
																					js.Node.console.log("Applying short sequence mode");
																					$r = __wrapper_28();
																					return $r;
																				}(this));
																			};
																			if(blastSettings.prog == "blastn") {
																				args.push("-dust");
																				args.push("no");
																				__wrapper_29();
																			} else __wrapper_29();
																		} else __wrapper_28();
																	} else __wrapper_28();
																})(saturn.core.FastaEntity.parseFasta(fasta));
															})(["-db",blastSettings.dbpath,"-query",inputFileName,"-out",outputFileName,"-html"]);
														})(Reflect.field(_g.saturn.localServerConfig.commands.sendBlastReport.arguments.BLAST_DB.allowedValues,blastDatabase));
													})(job.data.fasta);
												})(job.data.blastDatabase);
											})(inputFileName + ".html");
										})(info.path);
									};
									if(err1 != null) {
										_g.handleError(job,err1,done);
										__return();
									} else __wrapper_27();
								});
							})(new Buffer(job.data.fasta));
						};
						if(err != null) {
							_g.handleError(job,err,done);
							__return();
						} else __wrapper_26();
					});
				})(job.data.bioinfJobId);
				return;
			};
			if(socket != null) (function(ip) {
				ip;
				_g.broadcast("global.event",{ 'trigger' : ip, 'event' : "BLAST"});
				__wrapper_25();
			})(socket.handshake.address.address); else __wrapper_25();
		})(_g.getSocket(job));
	}
	,__class__: saturn.server.plugins.socket.BLASTPlugin
});
saturn.server.plugins.socket.ClustalPlugin = $hxClasses["saturn.server.plugins.socket.ClustalPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.ClustalPlugin.__name__ = ["saturn","server","plugins","socket","ClustalPlugin"];
saturn.server.plugins.socket.ClustalPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.ClustalPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		js.Node.console.info("Running clustalw");
		this.runClustal(job,done,cb);
	}
	,runClustal: function(job,done,__return) {
		var _g = this;
		(function(jobId) {
			jobId;
			(function(__afterVar_128) {
				bindings.NodeTemp.open("clustalQuery",function(__parameter_129,__parameter_130) {
					__afterVar_128(__parameter_129,__parameter_130);
				});
			})(function(err,info) {
				err;
				info;
				var __wrapper_23 = function() {
					(function(buffer) {
						buffer;
						(function(__afterVar_132) {
							js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_133) {
								__afterVar_132(__parameter_133);
							});
						})(function(err1) {
							err1;
							var __wrapper_24 = function() {
								return (function(inputFileName) {
									inputFileName;
									(function(outputFileName) {
										outputFileName;
										js.Node.console.log("Hello David");
										(function(proc) {
											proc;
											proc.stderr.on("data",function(error) {
												js.Node.console.log(error.toString());
											});
											proc.stdout.on("data",function(error1) {
												js.Node.console.log(error1.toString());
											});
											(function(__afterVar_137) {
												proc.on("close",function(__parameter_138) {
													__afterVar_137(__parameter_138);
												});
											})(function(code) {
												code;
												if(code == "0") (function(serveFileName) {
													serveFileName;
													(function(returnPath) {
														returnPath;
														(function(__afterVar_141) {
															bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_142) {
																__afterVar_141(__parameter_142);
															});
														})(function(err2) {
															err2;
															if(err2 != null) {
																_g.handleError(job,"An error has occurred making the results file available",done);
																__return();
															} else (function(socket) {
																socket;
																if(socket != null) {
																	js.Node.console.log("FINISHED");
																	_g.sendJson(job,{ clustalReport : returnPath},done);
																	__return();
																} else {
																	_g.handleError(job,"Unable to locate socket for job: " + jobId,done);
																	__return();
																}
															})(_g.getSocket(job));
														});
													})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)) + ".txt");
												})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)) + ".txt"); else {
													_g.handleError(job,"Clustal returned a non-zero exit status",done);
													__return();
												}
											});
										})(js.Node.require("child_process").spawn("bin/deployed_bin/clustalo",["--infile=" + inputFileName,"-o",outputFileName,"--outfmt=clustal"]));
									})(inputFileName + ".aln");
								})(info.path);
							};
							if(err1 != null) {
								_g.handleError(job,err1,done);
								__return();
							} else __wrapper_24();
						});
					})(new Buffer(job.data.fasta));
					return;
				};
				if(err != null) {
					_g.handleError(job,err,done);
					__return();
				} else __wrapper_23();
			});
		})(_g.getJobId(job));
	}
	,__class__: saturn.server.plugins.socket.ClustalPlugin
});
saturn.server.plugins.socket.DisoPredPlugin = $hxClasses["saturn.server.plugins.socket.DisoPredPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.DisoPredPlugin.__name__ = ["saturn","server","plugins","socket","DisoPredPlugin"];
saturn.server.plugins.socket.DisoPredPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.DisoPredPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		js.Node.console.info("Running DisoPred");
		this.runDisoPred(job,done,cb);
	}
	,runDisoPred: function(job,done,__return) {
		var _g = this;
		(function(jobId) {
			jobId;
			(function(__afterVar_96) {
				bindings.NodeTemp.open("disoPredQuery",function(__parameter_97,__parameter_98) {
					__afterVar_96(__parameter_97,__parameter_98);
				});
			})(function(err,info) {
				err;
				info;
				var __wrapper_17 = function() {
					(function(buffer) {
						buffer;
						(function(__afterVar_100) {
							js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_101) {
								__afterVar_100(__parameter_101);
							});
						})(function(err1) {
							err1;
							var __wrapper_18 = function() {
								return (function(inputFileName) {
									inputFileName;
									(function(outputFileName) {
										outputFileName;
										(function(cmd) {
											cmd;
											(function(dir) {
												dir;
												(function(proc) {
													proc;
													proc.stderr.on("data",function(error) {
														js.Node.console.log(error.toString());
													});
													proc.stdout.on("data",function(error1) {
														js.Node.console.log(error1.toString());
													});
													(function(__afterVar_107) {
														proc.on("close",function(__parameter_108) {
															__afterVar_107(__parameter_108);
														});
													})(function(code) {
														code;
														if(code == "0") (function(serveFileName) {
															serveFileName;
															(function(reportServeFileName) {
																reportServeFileName;
																js.Node.console.log("Copying " + outputFileName + " to " + serveFileName);
																(function(__afterVar_111) {
																	bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_112) {
																		__afterVar_111(__parameter_112);
																	});
																})(function(err2) {
																	err2;
																	var __wrapper_19 = function() {
																		return (function(__afterVar_113) {
																			js.Node.require("fs").readFile(serveFileName,null,function(__parameter_114,__parameter_115) {
																				__afterVar_113(__parameter_114,__parameter_115);
																			});
																		})(function(err_read,data) {
																			err_read;
																			data;
																			var __wrapper_20 = function() {
																				return (function(__afterVar_116) {
																					bindings.NodeTemp.open("psiPredQuery",function(__parameter_117,__parameter_118) {
																						__afterVar_116(__parameter_117,__parameter_118);
																					});
																				})(function(err_temp,info1) {
																					err_temp;
																					info1;
																					var __wrapper_21 = function() {
																						return (function(buffer1) {
																							buffer1;
																							(function(__afterVar_120) {
																								js.Node.require("fs").writeFile(info1.path,buffer1,function(__parameter_121) {
																									__afterVar_120(__parameter_121);
																								});
																							})(function(err_write) {
																								err_write;
																								var __wrapper_22 = function() {
																									return (function(htmlResultsFile) {
																										htmlResultsFile;
																										(function(reportHtmlResultsFile) {
																											reportHtmlResultsFile;
																											(function(__afterVar_124) {
																												bindings.NodeFSExtra.copy(info1.path,htmlResultsFile,function(__parameter_125) {
																													__afterVar_124(__parameter_125);
																												});
																											})(function(err3) {
																												err3;
																												(function(socket) {
																													socket;
																													if(socket != null) {
																														_g.sendJson(job,{ htmlDisoPredReport : reportHtmlResultsFile, rawHoriReport : reportServeFileName},done);
																														__return();
																													} else {
																														_g.handleError(job,"Unable to locate socket for job: " + jobId);
																														__return();
																													}
																												})(_g.getSocket(job));
																											});
																										})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)));
																									})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)));
																								};
																								if(err_write != null) {
																									_g.handleError(job,"An error has occurred writing the results file");
																									__return();
																								} else __wrapper_22();
																							});
																						})(new Buffer("<html><body><pre>" + data + "</pre></body></html>"));
																					};
																					if(err_temp != null) {
																						_g.handleError(job,"An error has occurred generating a temporary file for results");
																						__return();
																					} else __wrapper_21();
																				});
																			};
																			if(err_read != null) {
																				_g.handleError(job,"An error has occurred opening the results file");
																				__return();
																			} else __wrapper_20();
																		});
																	};
																	if(err2 != null) {
																		_g.handleError(job,"An error has occurred making the results file available");
																		__return();
																	} else __wrapper_19();
																});
															})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
														})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName))); else {
															_g.handleError(job,"PSIPRED has returned a non-zero exit status: " + code);
															__return();
														}
													});
												})(js.Node.require("child_process").spawn(cmd,[inputFileName],{ cwd : dir}));
											})("bin/disopred/unix");
										})("./rundisopred");
									})(inputFileName + ".horiz_d");
								})(info.path);
							};
							if(err1 != null) {
								_g.handleError(job,err1);
								__return();
							} else __wrapper_18();
						});
					})(new Buffer(job.data.fasta));
					return;
				};
				if(err != null) {
					_g.handleError(job,err);
					__return();
				} else __wrapper_17();
			});
		})(_g.getJobId(job));
	}
	,__class__: saturn.server.plugins.socket.DisoPredPlugin
});
saturn.server.plugins.socket.EmailPlugin = $hxClasses["saturn.server.plugins.socket.EmailPlugin"] = function(server,config) {
	saturn.server.plugins.socket.core.BaseServerSocketPlugin.call(this,server,config);
	this.registerCommands();
	this.configureTransporter();
};
saturn.server.plugins.socket.EmailPlugin.__name__ = ["saturn","server","plugins","socket","EmailPlugin"];
saturn.server.plugins.socket.EmailPlugin.__super__ = saturn.server.plugins.socket.core.BaseServerSocketPlugin;
saturn.server.plugins.socket.EmailPlugin.prototype = $extend(saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype,{
	transporter: null
	,getConfig: function() {
		return this.config;
	}
	,getTransporter: function() {
		return this.transporter;
	}
	,configureTransporter: function() {
		var nodemailer = js.Node.require("nodemailer");
		this.transporter = nodemailer.createTransport({ port : this.config.port, host : this.config.host, auth : { user : this.config.auth.user, pass : this.config.auth.password}});
	}
	,registerCommands: function() {
		var _g = this;
		this.registerListener("test",function(data,socket) {
			var user = _g.getSocketUserNoAuthCheck(socket);
			var email = user.email;
			_g.transporter.sendMail({ 'sender' : _g.config.from, 'from' : _g.config.from, 'replyTo' : email, 'to' : email, 'subject' : "Node H2IK", 'text' : "Evening!"},function(err) {
				_g.debug("Email Error " + err);
			});
		});
	}
	,__class__: saturn.server.plugins.socket.EmailPlugin
});
saturn.server.plugins.socket.FileUploader = $hxClasses["saturn.server.plugins.socket.FileUploader"] = function(server,config) {
	var _g = this;
	saturn.server.plugins.socket.core.BaseServerSocketPlugin.call(this,server,config);
	this.registerListener("upload",function(data,socket) {
		_g.upload(data,socket,function() {
		});
	});
};
saturn.server.plugins.socket.FileUploader.__name__ = ["saturn","server","plugins","socket","FileUploader"];
saturn.server.plugins.socket.FileUploader.__super__ = saturn.server.plugins.socket.core.BaseServerSocketPlugin;
saturn.server.plugins.socket.FileUploader.prototype = $extend(saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype,{
	upload: function(data,socket,__return) {
		var _g = this;
		(function(binaryData) {
			binaryData;
			(function(extension) {
				extension;
				(function(__afterVar_85) {
					bindings.NodeTemp.open("abi_conversion_",function(__parameter_86,__parameter_87) {
						__afterVar_85(__parameter_86,__parameter_87);
					});
				})(function(err,binary_info) {
					err;
					binary_info;
					var __wrapper_15 = function() {
						(function(__afterVar_88) {
							js.Node.require("fs").writeFile(binary_info.path,binaryData,function(__parameter_89) {
								__afterVar_88(__parameter_89);
							});
						})(function(err1) {
							err1;
							var __wrapper_16 = function() {
								return (function(outputFileName) {
									outputFileName;
									(function(serveFileName) {
										serveFileName;
										(function(returnPath) {
											returnPath;
											(function(__afterVar_93) {
												bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_94) {
													__afterVar_93(__parameter_94);
												});
											})(function(err2) {
												err2;
												_g.sendJson(data,{ url : returnPath},null);
												__return();
											});
										})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)) + "." + extension);
									})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)) + "." + extension);
								})(binary_info.path);
							};
							if(err1 != null) {
								_g.handleError(data,err1);
								__return();
							} else __wrapper_16();
						});
						return;
					};
					if(err != null) {
						_g.handleError(data,err);
						__return();
					} else __wrapper_15();
				});
			})(data.extension);
		})(new Buffer(data.fileContents,"base64"));
	}
	,__class__: saturn.server.plugins.socket.FileUploader
});
saturn.server.plugins.socket.PDBRetrievalPlugin = $hxClasses["saturn.server.plugins.socket.PDBRetrievalPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.PDBRetrievalPlugin.__name__ = ["saturn","server","plugins","socket","PDBRetrievalPlugin"];
saturn.server.plugins.socket.PDBRetrievalPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.PDBRetrievalPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		js.Node.console.info("Fetching PDB");
		this.fetch_pdb(job,done);
	}
	,fetch_pdb: function(job,done) {
		var _g = this;
		var pdb_id = job.data.pdbId;
		js.Node.require("needle").get("http://files.rcsb.org/view/" + pdb_id.toUpperCase() + ".pdb",function(error,response) {
			if(error == null && response.statusCode == 200) {
				js.Node.console.info("Sending response");
				var d = { };
				d.pdb = response.body;
				_g.sendJson(job,d,done);
			} else _g.sendError(job,"Unable to fetch PDB",done);
		});
	}
	,__class__: saturn.server.plugins.socket.PDBRetrievalPlugin
});
saturn.server.plugins.socket.PSIPREDPlugin = $hxClasses["saturn.server.plugins.socket.PSIPREDPlugin"] = function(server,config) {
	this.debug_psipred = (js.Node.require("debug"))("saturn:psipred");
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.PSIPREDPlugin.__name__ = ["saturn","server","plugins","socket","PSIPREDPlugin"];
saturn.server.plugins.socket.PSIPREDPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.PSIPREDPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	debug_psipred: null
	,processRequest: function(job,done,cb) {
		js.Node.console.info("Running PSIPRED");
		this.runPSIPRED(job,done,cb);
	}
	,runPSIPRED: function(job,done,__return) {
		var _g = this;
		(function(jobId) {
			jobId;
			_g.debug_psipred("Creating temporary file");
			(function(__afterVar_33) {
				bindings.NodeTemp.open("psiPredQuery",function(__parameter_34,__parameter_35) {
					__afterVar_33(__parameter_34,__parameter_35);
				});
			})(function(err,info) {
				err;
				info;
				var __wrapper_6 = function() {
					_g.debug_psipred("Writing FASTA");
					(function(buffer) {
						buffer;
						(function(__afterVar_37) {
							js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_38) {
								__afterVar_37(__parameter_38);
							});
						})(function(err1) {
							err1;
							var __wrapper_7 = function() {
								return (function(inputFileName) {
									inputFileName;
									(function(outputFileName) {
										outputFileName;
										(function(cmd) {
											cmd;
											(function(dir) {
												dir;
												var __wrapper_8 = function() {
													return (function($this) {
														var $r;
														_g.debug_psipred("Running PSIPred");
														$r = (function(proc) {
															proc;
															proc.stderr.on("data",function(error) {
																js.Node.console.log(error.toString());
															});
															proc.stdout.on("data",function(error1) {
																js.Node.console.log(error1.toString());
															});
															(function(__afterVar_44) {
																proc.on("close",function(__parameter_45) {
																	__afterVar_44(__parameter_45);
																});
															})(function(code) {
																code;
																if(code == "0") {
																	_g.debug_psipred("Preparing files for client");
																	(function(serveFileName) {
																		serveFileName;
																		(function(reportServeFileName) {
																			reportServeFileName;
																			(function(__afterVar_48) {
																				bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_49) {
																					__afterVar_48(__parameter_49);
																				});
																			})(function(err2) {
																				err2;
																				var __wrapper_9 = function() {
																					return (function(__afterVar_50) {
																						js.Node.require("fs").readFile(serveFileName,null,function(__parameter_51,__parameter_52) {
																							__afterVar_50(__parameter_51,__parameter_52);
																						});
																					})(function(err_read,data) {
																						err_read;
																						data;
																						var __wrapper_10 = function() {
																							return (function(__afterVar_53) {
																								bindings.NodeTemp.open("psiPredQuery",function(__parameter_54,__parameter_55) {
																									__afterVar_53(__parameter_54,__parameter_55);
																								});
																							})(function(err_temp,info1) {
																								err_temp;
																								info1;
																								var __wrapper_11 = function() {
																									return (function(buffer1) {
																										buffer1;
																										(function(__afterVar_57) {
																											js.Node.require("fs").writeFile(info1.path,buffer1,function(__parameter_58) {
																												__afterVar_57(__parameter_58);
																											});
																										})(function(err_write) {
																											err_write;
																											var __wrapper_12 = function() {
																												return (function(htmlResultsFile) {
																													htmlResultsFile;
																													(function(reportHtmlResultsFile) {
																														reportHtmlResultsFile;
																														(function(__afterVar_61) {
																															bindings.NodeFSExtra.copy(info1.path,htmlResultsFile,function(__parameter_62) {
																																__afterVar_61(__parameter_62);
																															});
																														})(function(err3) {
																															err3;
																															_g.debug_psipred("Sending response");
																															_g.sendJson(job,{ htmlPsiPredReport : reportHtmlResultsFile, rawHoriReport : reportServeFileName},done);
																															__return();
																														});
																													})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)) + ".html");
																												})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)) + ".html");
																											};
																											if(err_write != null) {
																												_g.handleError(job,"An error has occurred writing the results file",done);
																												__return();
																											} else __wrapper_12();
																										});
																									})(new Buffer("<html><body><pre>" + data + "</pre></body></html>"));
																								};
																								if(err_temp != null) {
																									_g.handleError(job,"An error has occurred generating a temporary file for results",done);
																									__return();
																								} else __wrapper_11();
																							});
																						};
																						if(err_read != null) {
																							_g.handleError(job,"An error has occurred opening the results file",done);
																							__return();
																						} else __wrapper_10();
																					});
																				};
																				if(err2 != null) {
																					_g.handleError(job,"An error has occurred making the results file available",done);
																					__return();
																				} else __wrapper_9();
																			});
																		})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
																	})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
																} else {
																	_g.handleError(job,"PSIPRED has returned a non-zero exit status: " + code,done);
																	__return();
																}
															});
														})(js.Node.require("child_process").spawn(cmd,[inputFileName],{ cwd : dir}));
														return $r;
													}(this));
												};
												if(js.Node.require("os").platform() == "win32") {
													cmd = "runpsipred_single.bat";
													dir = "bin\\deployed_bin\\psipred\\win\\";
													__wrapper_8();
												} else __wrapper_8();
											})("bin/psipred/unix");
										})("./runpsipred_single");
									})(inputFileName + ".horiz");
								})(info.path);
							};
							if(err1 != null) {
								_g.handleError(job,err1,done);
								__return();
							} else __wrapper_7();
						});
					})(new Buffer(job.data.fasta));
					return;
				};
				if(err != null) {
					_g.handleError(job,err,done);
					__return();
				} else __wrapper_6();
			});
		})(_g.getJobId(job));
	}
	,__class__: saturn.server.plugins.socket.PSIPREDPlugin
});
saturn.server.plugins.socket.PhyloPlugin = $hxClasses["saturn.server.plugins.socket.PhyloPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.PhyloPlugin.__name__ = ["saturn","server","plugins","socket","PhyloPlugin"];
saturn.server.plugins.socket.PhyloPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.PhyloPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		js.Node.console.info("Running Phylo");
		this.runPhylo(job,done,cb);
	}
	,runPhylo: function(job,done,__return) {
		var _g = this;
		(function(jobId) {
			jobId;
			(function(__afterVar_64) {
				bindings.NodeTemp.open("clustalQuery",function(__parameter_65,__parameter_66) {
					__afterVar_64(__parameter_65,__parameter_66);
				});
			})(function(err,info) {
				err;
				info;
				var __wrapper_13 = function() {
					(function(buffer) {
						buffer;
						(function(__afterVar_68) {
							js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_69) {
								__afterVar_68(__parameter_69);
							});
						})(function(err1) {
							err1;
							var __wrapper_14 = function() {
								return (function(inputFileName) {
									inputFileName;
									(function(proc) {
										proc;
										proc.on("error",function(err2) {
											if(err2 != null) {
												_g.handleError(job,"Error running CLUSTAL",done);
												return;
											}
										});
										proc.stderr.on("data",function(error) {
											js.Node.console.log(error.toString());
										});
										proc.stdout.on("data",function(error1) {
											js.Node.console.log(error1.toString());
										});
										(function(__afterVar_72) {
											proc.on("close",function(__parameter_73) {
												__afterVar_72(__parameter_73);
											});
										})(function(code) {
											code;
											if(code == "0") (function(outputFileName) {
												outputFileName;
												(function(proc1) {
													proc1;
													(function(__afterVar_76) {
														proc1.on("close",function(__parameter_77) {
															__afterVar_76(__parameter_77);
														});
													})(function(code1) {
														code1;
														if(code1 == "0") (function(serveFileName) {
															serveFileName;
															(function(returnPath) {
																returnPath;
																(function(__afterVar_80) {
																	bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_81) {
																		__afterVar_80(__parameter_81);
																	});
																})(function(err3) {
																	err3;
																	if(err3 != null) {
																		_g.handleError(job,"An error has occurred making the results file available",done);
																		__return();
																	} else (function(socket) {
																		socket;
																		if(socket != null) {
																			_g.sendJson(job,{ phyloReport : returnPath},done);
																			__return();
																		} else {
																			_g.handleError(job,"Unable to locate socket for job: " + jobId,done);
																			__return();
																		}
																	})(_g.getSocket(job));
																});
															})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
														})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName))); else {
															_g.handleError(job,"Clustal returned a non-zero exit status " + jobId,done);
															__return();
														}
													});
												})(js.Node.require("child_process").spawn("bin/clustalw2",["-infile=" + inputFileName + ".aln","-TREE","-SEED=1000","-OUTPUTTREE=nj","-CLUSTERING=NJ"]));
											})(inputFileName + ".ph"); else {
												_g.handleError(job,"Clustal returned a non-zero exit status",done);
												__return();
											}
										});
									})(js.Node.require("child_process").spawn("bin/clustalw2",["-infile=" + inputFileName,"-quiet","-outfile=" + inputFileName + ".aln"]));
								})(info.path);
							};
							if(err1 != null) {
								_g.handleError(job,err1);
								done();
								__return();
							} else __wrapper_14();
						});
					})(new Buffer(job.data.fasta));
					return;
				};
				if(err != null) {
					_g.handleError(job,err);
					done();
					__return();
				} else __wrapper_13();
			});
		})(_g.getJobId(job));
	}
	,__class__: saturn.server.plugins.socket.PhyloPlugin
});
saturn.server.plugins.socket.THMMPlugin = $hxClasses["saturn.server.plugins.socket.THMMPlugin"] = function(server,config) {
	saturn.server.plugins.socket.QueuePlugin.call(this,server,config);
};
saturn.server.plugins.socket.THMMPlugin.__name__ = ["saturn","server","plugins","socket","THMMPlugin"];
saturn.server.plugins.socket.THMMPlugin.__super__ = saturn.server.plugins.socket.QueuePlugin;
saturn.server.plugins.socket.THMMPlugin.prototype = $extend(saturn.server.plugins.socket.QueuePlugin.prototype,{
	processRequest: function(job,done,cb) {
		js.Node.console.info("Running THMM");
		this.runTHMM(job,done,cb);
	}
	,runTHMM: function(job,done,__return) {
		var _g = this;
		(function(jobId) {
			jobId;
			(function(__afterVar_1) {
				bindings.NodeTemp.open("tmhmmQuery",function(__parameter_2,__parameter_3) {
					__afterVar_1(__parameter_2,__parameter_3);
				});
			})(function(err,info) {
				err;
				info;
				var __wrapper_0 = function() {
					(function(buffer) {
						buffer;
						(function(__afterVar_5) {
							js.Node.require("fs").writeFile(info.path,buffer,function(__parameter_6) {
								__afterVar_5(__parameter_6);
							});
						})(function(err1) {
							err1;
							var __wrapper_1 = function() {
								return (function(inputFileName) {
									inputFileName;
									(function(outputFileName) {
										outputFileName;
										(function(cmd) {
											cmd;
											(function(dir) {
												dir;
												var __wrapper_2 = function() {
													return (function($this) {
														var $r;
														js.Node.console.log("H3: " + cmd);
														$r = (function(proc) {
															proc;
															proc.stderr.on("data",function(error) {
																js.Node.console.log(error.toString());
															});
															proc.stdout.on("data",function(error1) {
																js.Node.console.log(error1.toString());
															});
															js.Node.console.log("H4");
															(function(__afterVar_12) {
																proc.on("close",function(__parameter_13) {
																	__afterVar_12(__parameter_13);
																});
															})(function(code) {
																code;
																if(code == "0") {
																	js.Node.console.log("H5");
																	(function(serveFileName) {
																		serveFileName;
																		(function(reportServeFileName) {
																			reportServeFileName;
																			(function(__afterVar_16) {
																				bindings.NodeFSExtra.copy(outputFileName,serveFileName,function(__parameter_17) {
																					__afterVar_16(__parameter_17);
																				});
																			})(function(err2) {
																				err2;
																				var __wrapper_3 = function() {
																					return (function(__afterVar_18) {
																						js.Node.require("fs").readFile(serveFileName,null,function(__parameter_19,__parameter_20) {
																							__afterVar_18(__parameter_19,__parameter_20);
																						});
																					})(function(err_read,data) {
																						err_read;
																						data;
																						var __wrapper_4 = function() {
																							return (function(__afterVar_21) {
																								bindings.NodeTemp.open("tmhmmQuery",function(__parameter_22,__parameter_23) {
																									__afterVar_21(__parameter_22,__parameter_23);
																								});
																							})(function(err_temp,info1) {
																								err_temp;
																								info1;
																								var __wrapper_5 = function() {
																									return (function(buffer1) {
																										buffer1;
																										(function(__afterVar_25) {
																											js.Node.require("fs").writeFile(info1.path,buffer1,function(__parameter_26) {
																												__afterVar_25(__parameter_26);
																											});
																										})(function(err_write) {
																											err_write;
																											if(err_write != null) {
																												_g.handleError(job,"An error has occurred writing the results file");
																												__return();
																											} else (function(htmlResultsFile) {
																												htmlResultsFile;
																												(function(reportHtmlResultsFile) {
																													reportHtmlResultsFile;
																													(function(__afterVar_29) {
																														bindings.NodeFSExtra.copy(info1.path,htmlResultsFile,function(__parameter_30) {
																															__afterVar_29(__parameter_30);
																														});
																													})(function(err3) {
																														err3;
																														(function(socket) {
																															socket;
																															if(socket != null) {
																																_g.sendJson(job,{ htmlTMHMMReport : reportHtmlResultsFile, rawReport : reportServeFileName},done);
																																__return();
																															} else {
																																_g.handleError(job,"Unable to locate socket for job: " + jobId,done);
																																__return();
																															}
																														})(_g.getSocket(job));
																													});
																												})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)) + ".html");
																											})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(info1.path)) + ".html");
																										});
																									})(new Buffer("<html><body><pre>" + data + "</pre></body></html>"));
																								};
																								if(err_temp != null) {
																									_g.handleError(job,"An error has occurred generating a temporary file for results",done);
																									__return();
																								} else __wrapper_5();
																							});
																						};
																						if(err_read != null) {
																							_g.handleError(job,"An error has occurred opening the results file",done);
																							__return();
																						} else __wrapper_4();
																					});
																				};
																				if(err2 != null) {
																					_g.handleError(job,"An error has occurred making the results file available",done);
																					__return();
																				} else __wrapper_3();
																			});
																		})(_g.saturn.getRelativePublicOuputURL() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
																	})(_g.saturn.getRelativePublicOuputFolder() + "/" + Std.string(_g.saturn.pathLib.basename(outputFileName)));
																} else {
																	_g.handleError(job,"PSIPRED has returned a non-zero exit status: " + code,done);
																	__return();
																}
															});
														})(js.Node.require("child_process").spawn(cmd,[info.path,outputFileName],{ cwd : dir}));
														return $r;
													}(this));
												};
												if(js.Node.require("os").platform() == "win32") {
													_g.handleError(job,"TMHMM is not supported on Windows platform",done);
													__return();
												} else __wrapper_2();
											})("bin/tmhmm/unix");
										})("./runsingle_tmhmm.sh");
									})(inputFileName + ".formatted");
								})(info.path);
							};
							if(err1 != null) {
								_g.handleError(job,err1);
								__return();
							} else __wrapper_1();
						});
					})(new Buffer(job.data.fasta));
					return;
				};
				if(err != null) {
					_g.handleError(job,err);
					__return();
				} else __wrapper_0();
			});
		})(_g.getJobId(job));
	}
	,__class__: saturn.server.plugins.socket.THMMPlugin
});
saturn.server.plugins.socket.core.RemoteProviderPlugin = $hxClasses["saturn.server.plugins.socket.core.RemoteProviderPlugin"] = function(server,config) {
	saturn.server.plugins.socket.core.BaseServerSocketPlugin.call(this,server,config);
	this.registerProviderCommand("_request_models",$bind(this,this.getModels));
	this.registerProviderCommand("_data_request_objects_idstartswith",$bind(this,this.getByIdStartsWith));
	this.registerProviderCommand("_data_request_objects_ids",$bind(this,this.getObjectIds));
	this.registerProviderCommand("_data_request_objects_values",$bind(this,this.getByValues));
	this.registerProviderCommand("_data_request_objects_pkeys",$bind(this,this.getByPkeys));
	this.registerProviderCommand("_data_request_objects_by_class",$bind(this,this.getByClass));
	this.registerProviderCommand("_data_request_objects_namedquery",$bind(this,this.getByNamedQuery));
	this.registerProviderCommand("_data_delete_request",$bind(this,this["delete"]));
	this.registerProviderCommand("_data_insert_request",$bind(this,this.insert));
	this.registerProviderCommand("_data_update_request",$bind(this,this.update));
	this.registerProviderCommand("_data_commit_request",$bind(this,this.commit));
	this.registerProviderCommand("_data_request_query",$bind(this,this.query));
	this.registerProviderCommand("_data_request_upload_file",$bind(this,this.uploadFile));
};
saturn.server.plugins.socket.core.RemoteProviderPlugin.__name__ = ["saturn","server","plugins","socket","core","RemoteProviderPlugin"];
saturn.server.plugins.socket.core.RemoteProviderPlugin.__super__ = saturn.server.plugins.socket.core.BaseServerSocketPlugin;
saturn.server.plugins.socket.core.RemoteProviderPlugin.prototype = $extend(saturn.server.plugins.socket.core.BaseServerSocketPlugin.prototype,{
	registerProviderCommand: function(command,cb) {
		var _g = this;
		this.registerListener(command,function(data,socket) {
			var user = _g.getSocketUserNoAuthCheck(socket);
			var providerName = saturn.client.core.CommonCore.getDefaultProviderName();
			if(Object.prototype.hasOwnProperty.call(data,"queryId")) {
				var namedQuery = Reflect.field(data,"queryId");
				_g.debug("Looking " + namedQuery);
				providerName = saturn.client.core.CommonCore.getProviderForNamedQuery(namedQuery);
				_g.debug("Got for named query: " + providerName);
			} else if(Object.prototype.hasOwnProperty.call(data,"class_name")) {
				_g.debug("Looking for provider");
				providerName = saturn.client.core.CommonCore.getProviderNameForModel(data.class_name);
				if(providerName == null) {
					_g.debug("Error finding provider for " + Std.string(data.class_name));
					_g.handleError(data,"Unable to find source for entity");
					return;
				}
			} else if(Object.prototype.hasOwnProperty.call(data,"queryStr")) {
				var query = saturn.db.query_lang.Query.deserialise(Reflect.field(data,"queryStr"));
				data.queryObj = query;
				var clazzList = query.getClassList();
				var clazz_name = clazzList[0];
				_g.debug(clazz_name);
				providerName = saturn.client.core.CommonCore.getProviderNameForModel(clazz_name);
				_g.debug(providerName);
				if(providerName == null) {
					_g.debug("Error finding provider for " + clazz_name);
					_g.handleError(data,"Unable to find source for entity");
					return;
				}
			}
			saturn.client.core.CommonCore.getDefaultProvider(function(err,provider) {
				if(err != null) _g.handleError(data,err); else {
					var disconnectOnEnd = false;
					var connectAsUser = "";
					var config = provider.getConfig();
					if(config != null) connectAsUser = config.connect_as_user;
					if(command != "_request_models" && (connectAsUser == "preferred" || connectAsUser == "force")) {
						_g.debug("Connect as user is: " + connectAsUser);
						if(user == null) {
							if(connectAsUser == "force") {
								_g.debug("Connect as user is forced but user is not logged in to " + providerName + " " + command);
								_g.handleError(data,"You must be logged in to use this provider");
								return;
							}
						} else {
							_g.debug("Connecting as user");
							provider = provider.generatedLinkedClone();
							provider.setConnectAsUser(true);
							provider.setUser(user);
							disconnectOnEnd = true;
						}
					}
					_g.debug("Calling method on Provider");
					cb(data,provider,user,function() {
						if(disconnectOnEnd) provider._closeConnection();
					});
				}
			},providerName);
		});
	}
	,getModels: function(data,provider,user,cb) {
		var json = { };
		var combined_models = saturn.client.core.CommonCore.getCombinedModels();
		json.models = haxe.Serializer.run(combined_models);
		this.sendJson(data,json,null);
		cb();
	}
	,getByIdStartsWith: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.getByIdStartsWith(data.id,data.field,Type.resolveClass(data.class_name),data.limit,function(objs,err) {
				var json = { };
				var i = saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.handleError(data,e);
			cb();
		}
	}
	,query: function(data,provider,user,cb) {
		var _g = this;
		try {
			var queryObj = data.queryObj;
			this.debug(Type.getClassName(queryObj == null?null:js.Boot.getClass(queryObj)));
			provider.query(queryObj,function(objs,err) {
				var json = { };
				var i = saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			saturn.core.Util.debug(e);
			this.handleError(data,e);
			cb();
		}
	}
	,getObjectIds: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.getByIds(data.ids,Type.resolveClass(data.class_name),function(objs,err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,getByValues: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.getByValues(data.values,Type.resolveClass(data.class_name),data.field,function(objs,err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,getByPkeys: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.getByPkeys(data.ids,Type.resolveClass(data.class_name),function(objs,err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,getByClass: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.getObjects(Type.resolveClass(data.class_name),function(objs,err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,getByNamedQuery: function(data,provider,user,cb) {
		var _g = this;
		try {
			this.debug("Start");
			var params = haxe.Unserializer.run(data.parameters);
			this.debug("End");
			if(data.queryId == "saturn.workflow") params[1].setRemote(true);
			params = this.autoCompleteFields(params,user);
			var clazz = null;
			if(data.class_name != null) clazz = Type.resolveClass(data.class_name);
			provider.getByNamedQuery(data.queryId,params,clazz,false,function(objs,err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				json.objects = objs;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,autoCompleteFields: function(params,user) {
		var retParams = [];
		var _g = 0;
		while(_g < params.length) {
			var paramSet = params[_g];
			++_g;
			var _g1 = 0;
			var _g2 = Reflect.fields(paramSet);
			while(_g1 < _g2.length) {
				var field = _g2[_g1];
				++_g1;
				if(field == "_username") {
					saturn.core.Util.debug("Setting username to " + user.username);
					paramSet._username = user.username;
				}
			}
			retParams.push(paramSet);
		}
		return retParams;
	}
	,'delete': function(data,provider,user,cb) {
		var _g = this;
		try {
			var objs = this.convertJsonObjectArray(data.objs);
			provider._delete(objs,data.class_name,function(err) {
				var json = { };
				json.error = err;
				saturn.client.core.CommonCore.releaseResource(provider);
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,insert: function(data,provider,user,cb) {
		var _g = this;
		var objs = this.convertJsonObjectArray(data.objs);
		provider._insert(objs,data.class_name,function(err) {
			var json = { };
			saturn.client.core.CommonCore.releaseResource(provider);
			js.Node.console.log("Returning from insert: " + err);
			if(err != null) _g.handleError(data,err,null); else _g.sendJson(data,json,null);
			cb();
		});
	}
	,update: function(data,provider,user,cb) {
		var _g = this;
		try {
			var objs = this.convertJsonObjectArray(data.objs);
			provider._update(objs,data.class_name,function(err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,commit: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.commit(function(err) {
				var json = { };
				saturn.client.core.CommonCore.releaseResource(provider);
				json.error = err;
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,convertJsonObjectArray: function(jsonObjsStr) {
		var jsonObjs = JSON.parse(jsonObjsStr);
		var objs = [];
		var _g = 0;
		while(_g < jsonObjs.length) {
			var jsonObj = jsonObjs[_g];
			++_g;
			var obj = new haxe.ds.StringMap();
			var _g1 = 0;
			var _g2 = Reflect.fields(jsonObj);
			while(_g1 < _g2.length) {
				var field = _g2[_g1];
				++_g1;
				var value = Reflect.field(jsonObj,field);
				if(__map_reserved[field] != null) obj.setReserved(field,value); else obj.h[field] = value;
			}
			objs.push(obj);
		}
		return objs;
	}
	,uploadFile: function(data,provider,user,cb) {
		var _g = this;
		try {
			provider.uploadFile(data.contents,data.file_identifier,function(err,upload_id) {
				var json = { 'upload_id' : upload_id};
				saturn.client.core.CommonCore.releaseResource(provider);
				_g.sendJson(data,json,null);
				cb();
			});
		} catch( e ) {
			if (e instanceof js._Boot.HaxeError) e = e.val;
			saturn.client.core.CommonCore.releaseResource(provider);
			this.sendError(data,e,null);
			cb();
		}
	}
	,__class__: saturn.server.plugins.socket.core.RemoteProviderPlugin
});
saturn.server.plugins.socket.core.SocketIOException = $hxClasses["saturn.server.plugins.socket.core.SocketIOException"] = function(err) {
	saturn.util.HaxeException.call(this,err);
};
saturn.server.plugins.socket.core.SocketIOException.__name__ = ["saturn","server","plugins","socket","core","SocketIOException"];
saturn.server.plugins.socket.core.SocketIOException.__super__ = saturn.util.HaxeException;
saturn.server.plugins.socket.core.SocketIOException.prototype = $extend(saturn.util.HaxeException.prototype,{
	__class__: saturn.server.plugins.socket.core.SocketIOException
});
if(!saturn.server.plugins.socket.email) saturn.server.plugins.socket.email = {};
saturn.server.plugins.socket.email.BaseEmailPlugin = $hxClasses["saturn.server.plugins.socket.email.BaseEmailPlugin"] = function(emailer,config) {
	this.emailer = emailer;
	this.config = config;
	this.registerListeners();
};
saturn.server.plugins.socket.email.BaseEmailPlugin.__name__ = ["saturn","server","plugins","socket","email","BaseEmailPlugin"];
saturn.server.plugins.socket.email.BaseEmailPlugin.prototype = {
	emailer: null
	,config: null
	,registerListeners: function() {
	}
	,__class__: saturn.server.plugins.socket.email.BaseEmailPlugin
};
saturn.server.plugins.socket.email.SgcPrimerEmailPlugin = $hxClasses["saturn.server.plugins.socket.email.SgcPrimerEmailPlugin"] = function(emailer,config) {
	saturn.server.plugins.socket.email.BaseEmailPlugin.call(this,emailer,config);
};
saturn.server.plugins.socket.email.SgcPrimerEmailPlugin.__name__ = ["saturn","server","plugins","socket","email","SgcPrimerEmailPlugin"];
saturn.server.plugins.socket.email.SgcPrimerEmailPlugin.__super__ = saturn.server.plugins.socket.email.BaseEmailPlugin;
saturn.server.plugins.socket.email.SgcPrimerEmailPlugin.prototype = $extend(saturn.server.plugins.socket.email.BaseEmailPlugin.prototype,{
	registerListeners: function() {
		var _g = this;
		this.emailer.registerListener("sgc_primer_email",function(data,socket) {
			var user = _g.emailer.getSocketUserNoAuthCheck(socket);
			var email = user.email;
			var fileName = data.fileName;
			var content = data.content;
			var description = data.description;
			var ccList = _g.config.cc;
			var match = false;
			var _g1 = 0;
			while(_g1 < ccList.length) {
				var cc = ccList[_g1];
				++_g1;
				if(cc == email) match = true;
			}
			if(!match) ccList.push(email);
			_g.emailer.getTransporter().sendMail({ 'sender' : _g.emailer.getConfig().from, 'from' : _g.emailer.getConfig().from, 'replyTo' : email, 'to' : _g.config.to, 'cc' : ccList, 'subject' : "Primer Request", 'text' : "See attached for primer request from " + user.firstname + " " + user.lastname + " for " + description, 'attachments' : [{ 'filename' : fileName, 'content' : content}]},function(err) {
				if(err == null) _g.emailer.sendJson(data,{ error : null},null); else _g.emailer.handleError(data,"Unable to send email");
			});
		});
	}
	,__class__: saturn.server.plugins.socket.email.SgcPrimerEmailPlugin
});
saturn.util.StringUtils = $hxClasses["saturn.util.StringUtils"] = function() { };
saturn.util.StringUtils.__name__ = ["saturn","util","StringUtils"];
saturn.util.StringUtils.getRepeat = function(txt,count) {
	var stringBuf_b = "";
	var _g = 0;
	while(_g < count) {
		var i = _g++;
		if(txt == null) stringBuf_b += "null"; else stringBuf_b += "" + txt;
	}
	return stringBuf_b;
};
saturn.util.StringUtils.reverse = function(txt) {
	var cols = txt.split("");
	cols.reverse();
	return cols.join("");
};
saturn.util.StringUtils.__super__ = StringTools;
saturn.util.StringUtils.prototype = $extend(StringTools.prototype,{
	__class__: saturn.util.StringUtils
});
if(!saturn.workflow) saturn.workflow = {};
saturn.workflow.Chain = $hxClasses["saturn.workflow.Chain"] = function() {
	this.items = [];
	this.pos = 0;
	this.provider = saturn.core.Util.getProvider();
};
saturn.workflow.Chain.__name__ = ["saturn","workflow","Chain"];
saturn.workflow.Chain.prototype = {
	items: null
	,pos: null
	,provider: null
	,done: null
	,add: function(item,config) {
		this.items.push(new saturn.workflow.ChainUnit(item,config));
	}
	,next: function() {
		var _g = this;
		if(this.pos <= this.items.length - 1) {
			var unit = this.items[this.pos++];
			var handler = function(resp) {
				saturn.core.Util.debug("Workflow returning");
				var error = resp.getError();
				if(error != null) {
					_g.die(error);
					return;
				} else {
					unit.getConfig().setResponse(resp);
					_g.next();
				}
			};
			var config = unit.getConfig();
			if(this.pos > 1) config.setData(this.items[this.pos - 2].getConfig().getResponse());
			if(unit.isDirectMethod()) (unit.getDirectMethod())(config,handler); else {
				saturn.core.Util.debug("Workflow running unit: " + unit.getQName());
				this.provider.getByNamedQuery("saturn.workflow",[unit.getQName(),config],unit.getResponseClass(),true,function(objs,error1) {
					if(error1 != null) _g.die(error1); else handler(objs[0]);
				});
			}
		} else this.done(null);
	}
	,start: function(cb) {
		this.done = cb;
		this.next();
	}
	,die: function(error) {
		this.done(error);
	}
	,__class__: saturn.workflow.Chain
};
saturn.workflow.ChainUnit = $hxClasses["saturn.workflow.ChainUnit"] = function(item,config) {
	this.config = config;
	this.method = null;
	if(typeof(item) == "string") {
		var qName = item;
		var lastI = qName.lastIndexOf(".");
		this.qualifiedClassName = qName.substring(0,lastI);
		this.methodName = qName.substring(lastI + 1,qName.length);
		this.packageName = this.qualifiedClassName.substring(0,this.qualifiedClassName.lastIndexOf("."));
		var classShortName = this.qualifiedClassName.substring(this.qualifiedClassName.lastIndexOf(".") + 1,this.qualifiedClassName.length);
		this.qualifiedName = qName;
		this.responseClassName = this.packageName + "." + classShortName + "Response";
	} else this.method = item;
};
saturn.workflow.ChainUnit.__name__ = ["saturn","workflow","ChainUnit"];
saturn.workflow.ChainUnit.prototype = {
	qualifiedName: null
	,packageName: null
	,qualifiedClassName: null
	,methodName: null
	,responseClassName: null
	,config: null
	,method: null
	,isDirectMethod: function() {
		return this.method != null;
	}
	,getDirectMethod: function() {
		return this.method;
	}
	,setConfig: function(config) {
		this.config = config;
	}
	,getQName: function() {
		return this.qualifiedName;
	}
	,getMethodName: function() {
		return this.methodName;
	}
	,getClassName: function() {
		return this.qualifiedClassName;
	}
	,getResponseClass: function() {
		return Type.resolveClass(this.responseClassName);
	}
	,getConfig: function() {
		return this.config;
	}
	,__class__: saturn.workflow.ChainUnit
};
saturn.workflow.DBtoFASTA = $hxClasses["saturn.workflow.DBtoFASTA"] = function(config,cb) {
	this.config = config;
	this.cb = cb;
	this.response = new saturn.workflow.DBtoFASTAResponse(null);
};
saturn.workflow.DBtoFASTA.__name__ = ["saturn","workflow","DBtoFASTA"];
saturn.workflow.DBtoFASTA.query = function(config,cb) {
	var runner = new saturn.workflow.DBtoFASTA(config,cb);
	runner.run();
};
saturn.workflow.DBtoFASTA.prototype = {
	config: null
	,cb: null
	,response: null
	,run: function() {
		var _g = this;
		var p = saturn.client.core.CommonCore.getDefaultProvider();
		saturn.core.Util.debug("Fetching sequences for " + this.config.getDatabaseName());
		p.getByNamedQuery("FETCH_PROTEINS",[this.config.getDatabaseName()],saturn.core.domain.Molecule,false,function(objs,error) {
			saturn.core.Util.debug("Objects fetched " + objs.length);
			if(error != null) {
				_g.response.setError(error);
				_g.done();
			} else saturn.core.Util.opentemp("sequences_",function(error1,fd,path) {
				if(error1 != null) {
					_g.response.setError(error1);
					_g.done();
				} else {
					saturn.core.Util.debug(path);
					var added = 10;
					var limit = _g.config.getLimit();
					var _g1 = 0;
					while(_g1 < objs.length) {
						var obj = objs[_g1];
						++_g1;
						if(obj.sequence != null) {
							fd.write(">" + obj.name + "\n" + obj.sequence + "\n");
							if(limit != -1 && limit == added) {
								saturn.core.Util.debug("Breaking");
								break;
							} else added++;
						}
					}
					fd.end(function(error2) {
						if(error2 != null) {
							_g.response.setError(error2);
							_g.done();
						} else {
							_g.response.setFastaFilePath(path);
							_g.done();
						}
					});
				}
			});
		});
	}
	,done: function() {
		saturn.core.Util.debug("Workflow item finished");
		this.cb(this.response);
	}
	,__class__: saturn.workflow.DBtoFASTA
};
saturn.workflow.Object = $hxClasses["saturn.workflow.Object"] = function() {
	this.remote = false;
};
saturn.workflow.Object.__name__ = ["saturn","workflow","Object"];
saturn.workflow.Object.prototype = {
	error: null
	,data: null
	,response: null
	,remote: null
	,setRemote: function(remote) {
		this.remote = remote;
	}
	,isRemote: function() {
		return this.remote;
	}
	,getParameter: function(param) {
		var data = this.getData();
		if(data != null && Object.prototype.hasOwnProperty.call(data,param)) return Reflect.field(data,param); else if(Object.prototype.hasOwnProperty.call(this,param)) return Reflect.field(this,param); else return null;
	}
	,setError: function(error) {
		saturn.core.Util.debug(error);
		this.error = error;
	}
	,getError: function() {
		return this.error;
	}
	,setData: function(data) {
		this.data = data;
	}
	,getData: function() {
		return this.data;
	}
	,getResponse: function() {
		return this.response;
	}
	,setResponse: function(resp) {
		this.response = resp;
	}
	,setup: function(cb) {
	}
	,__class__: saturn.workflow.Object
};
saturn.workflow.DBtoFASTAConfig = $hxClasses["saturn.workflow.DBtoFASTAConfig"] = function(databaseName,type) {
	saturn.workflow.Object.call(this);
	this.databaseName = databaseName;
	this.type = type;
	this.limit = -1;
};
saturn.workflow.DBtoFASTAConfig.__name__ = ["saturn","workflow","DBtoFASTAConfig"];
saturn.workflow.DBtoFASTAConfig.__super__ = saturn.workflow.Object;
saturn.workflow.DBtoFASTAConfig.prototype = $extend(saturn.workflow.Object.prototype,{
	databaseName: null
	,type: null
	,limit: null
	,setLimit: function(limit) {
		this.limit = limit;
	}
	,getLimit: function() {
		return this.limit;
	}
	,getDatabaseName: function() {
		return this.databaseName;
	}
	,__class__: saturn.workflow.DBtoFASTAConfig
});
saturn.workflow.SequenceType = $hxClasses["saturn.workflow.SequenceType"] = { __ename__ : ["saturn","workflow","SequenceType"], __constructs__ : ["PROTEIN","DNA"] };
saturn.workflow.SequenceType.PROTEIN = ["PROTEIN",0];
saturn.workflow.SequenceType.PROTEIN.toString = $estr;
saturn.workflow.SequenceType.PROTEIN.__enum__ = saturn.workflow.SequenceType;
saturn.workflow.SequenceType.DNA = ["DNA",1];
saturn.workflow.SequenceType.DNA.toString = $estr;
saturn.workflow.SequenceType.DNA.__enum__ = saturn.workflow.SequenceType;
saturn.workflow.DBtoFASTAResponse = $hxClasses["saturn.workflow.DBtoFASTAResponse"] = function(fastaFilePath) {
	saturn.workflow.Object.call(this);
	this.fastaFilePath = fastaFilePath;
};
saturn.workflow.DBtoFASTAResponse.__name__ = ["saturn","workflow","DBtoFASTAResponse"];
saturn.workflow.DBtoFASTAResponse.__super__ = saturn.workflow.Object;
saturn.workflow.DBtoFASTAResponse.prototype = $extend(saturn.workflow.Object.prototype,{
	fastaFilePath: null
	,setFastaFilePath: function(path) {
		this.fastaFilePath = path;
	}
	,getFastaFilePath: function() {
		return this.fastaFilePath;
	}
	,__class__: saturn.workflow.DBtoFASTAResponse
});
saturn.workflow.Unit = $hxClasses["saturn.workflow.Unit"] = function(config,cb) {
	this.cb = cb;
	this.config = config;
};
saturn.workflow.Unit.__name__ = ["saturn","workflow","Unit"];
saturn.workflow.Unit.prototype = {
	response: null
	,config: null
	,cb: null
	,done: function() {
		saturn.core.Util.debug("Workflow item finished");
		this.cb(this.response);
	}
	,setup: function(cb) {
		if(this.config != null) this.config.setup(cb); else cb(null);
	}
	,run: function() {
		var _g = this;
		this.setup(function(err) {
			if(err != null) {
				_g.response.setError(err);
				_g.done();
			} else _g._run();
		});
	}
	,_run: function() {
	}
	,__class__: saturn.workflow.Unit
};
saturn.workflow.HMMer = $hxClasses["saturn.workflow.HMMer"] = function(config,cb) {
	this.hmmPath = "bin/hmmer";
	saturn.workflow.Unit.call(this,config,cb);
	this.response = new saturn.workflow.HMMerResponse();
	this.hmmSearchPath = this.hmmPath + "/hmmsearch";
};
saturn.workflow.HMMer.__name__ = ["saturn","workflow","HMMer"];
saturn.workflow.HMMer.query = function(config,cb) {
	saturn.core.Util.debug("HMMer query started");
	var runner = new saturn.workflow.HMMer(config,cb);
	runner.run();
};
saturn.workflow.HMMer.__super__ = saturn.workflow.Unit;
saturn.workflow.HMMer.prototype = $extend(saturn.workflow.Unit.prototype,{
	hmmPath: null
	,hmmSearchPath: null
	,getHMMPath: function() {
		return this.hmmPath;
	}
	,getHMMSearchPath: function() {
		return this.hmmSearchPath;
	}
	,_run: function() {
		if(this.config.getProgram() == saturn.workflow.HMMerProgram.HMMSEARCH) this.runHMMSearch(); else if(this.config.getProgram() == saturn.workflow.HMMerProgram.HMMUPLOAD) this.runUpload(); else saturn.core.Util.debug("Unknown program: " + Std.string(this.config.getProgram()));
	}
	,runHMMSearch: function() {
		var _g = this;
		saturn.core.Util.debug("Running HMMSearch");
		var fastaFile = this.config.getParameter("fastaFilePath");
		if(fastaFile != null) {
			var data = this.config.getData();
			saturn.core.Util.opentemp("hmm_table_",function(error,stream,path_table) {
				if(error != null) _g.response.setError(error); else saturn.core.Util.opentemp("hmm_raw_",function(error1,stream1,path_raw) {
					if(error1 != null) _g.response.setError(error1); else {
						var args = ["--domtblout",path_table,"--noali","-o",path_raw,_g.config.getParameter("hmmFilePath"),_g.config.getParameter("fastaFilePath")];
						saturn.core.Util.debug(args.join(","));
						saturn.core.Util.exec(_g.hmmSearchPath,args,function(code) {
							if(code != 0) {
								_g.response.setError("An error has occurred running HMMSearch");
								_g.done();
							} else if(_g.config.isRemote()) saturn.app.SaturnServer.makeStaticAvailable(path_table,function(err,path) {
								if(err == null) _g.response.setTableOutputPath(path); else _g.response.setError(err);
								_g.done();
							}); else {
								_g.response.setTableOutputPath(path_table);
								_g.response.setRawOutputPath(path_raw);
								_g.done();
							}
						});
					}
				});
			});
		} else {
			this.response.setError("fastaFilePath missing!");
			this.done();
		}
	}
	,runUpload: function() {
		var _g = this;
		var uploader = new saturn.core.domain.Uploader("PFAM",0.0000001);
		var p = saturn.core.Util.getProvider();
		p.setAutoCommit(false,function(err) {
			var parser = new saturn.core.parsers.HmmerParser(_g.config.getParameter("tableOutputPath"),$bind(uploader,uploader.next),function(err1) {
				if(err1 == null) p.commit(function(err2) {
					if(err2 != null) _g.response.setError(err2); else saturn.core.Util.debug("Commit called");
					_g.done();
				}); else {
					_g.response.setError(err1);
					_g.done();
				}
			});
		});
	}
	,__class__: saturn.workflow.HMMer
});
saturn.workflow.HMMerConfig = $hxClasses["saturn.workflow.HMMerConfig"] = function(program) {
	saturn.workflow.Object.call(this);
	this.program = program;
};
saturn.workflow.HMMerConfig.__name__ = ["saturn","workflow","HMMerConfig"];
saturn.workflow.HMMerConfig.__super__ = saturn.workflow.Object;
saturn.workflow.HMMerConfig.prototype = $extend(saturn.workflow.Object.prototype,{
	hmmFilePath: null
	,fastaFilePath: null
	,tableOutputPath: null
	,fastaContent: null
	,program: null
	,getProgram: function() {
		return this.program;
	}
	,setProgram: function(program) {
		this.program = program;
	}
	,setHMMPath: function(hmmFilePath) {
		this.hmmFilePath = hmmFilePath;
	}
	,setFastaFilePath: function(fastaFilePath) {
		this.fastaFilePath = fastaFilePath;
	}
	,setFastaContent: function(fastaContent) {
		this.fastaContent = fastaContent;
	}
	,setup: function(cb) {
		var _g = this;
		if(this.fastaFilePath == null && this.fastaContent != null) saturn.core.Util.opentemp("fasta_file_",function(error,stream,path) {
			if(error == null) stream.write(_g.fastaContent);
			_g.fastaFilePath = path;
			cb(error);
		});
	}
	,__class__: saturn.workflow.HMMerConfig
});
saturn.workflow.HMMerProgram = $hxClasses["saturn.workflow.HMMerProgram"] = { __ename__ : ["saturn","workflow","HMMerProgram"], __constructs__ : ["HMMSEARCH","HMMUPLOAD"] };
saturn.workflow.HMMerProgram.HMMSEARCH = ["HMMSEARCH",0];
saturn.workflow.HMMerProgram.HMMSEARCH.toString = $estr;
saturn.workflow.HMMerProgram.HMMSEARCH.__enum__ = saturn.workflow.HMMerProgram;
saturn.workflow.HMMerProgram.HMMUPLOAD = ["HMMUPLOAD",1];
saturn.workflow.HMMerProgram.HMMUPLOAD.toString = $estr;
saturn.workflow.HMMerProgram.HMMUPLOAD.__enum__ = saturn.workflow.HMMerProgram;
saturn.workflow.HMMerResponse = $hxClasses["saturn.workflow.HMMerResponse"] = function() {
	saturn.workflow.Object.call(this);
	this.tableOutputPath = "Test";
};
saturn.workflow.HMMerResponse.__name__ = ["saturn","workflow","HMMerResponse"];
saturn.workflow.HMMerResponse.__super__ = saturn.workflow.Object;
saturn.workflow.HMMerResponse.prototype = $extend(saturn.workflow.Object.prototype,{
	tableOutputPath: null
	,rawOutputPath: null
	,setTableOutputPath: function(path) {
		this.tableOutputPath = path;
	}
	,getTableOutputPath: function() {
		return this.tableOutputPath;
	}
	,setRawOutputPath: function(path) {
		this.rawOutputPath = path;
	}
	,getRawOutputPath: function() {
		return this.rawOutputPath;
	}
	,__class__: saturn.workflow.HMMerResponse
});
saturn.workflow.Pfam = $hxClasses["saturn.workflow.Pfam"] = function() {
};
saturn.workflow.Pfam.__name__ = ["saturn","workflow","Pfam"];
saturn.workflow.Pfam.prototype = {
	query: function() {
	}
	,__class__: saturn.workflow.Pfam
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
bindings.NodeFSExtra.fsExtra = require('fs-extra');
var NodePostgres = require('pg').Client;
bindings.NodeTemp.temp = require('temp');
var Sqlite3 = require('sqlite3').verbose().Database;
var __map_reserved = {}
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
js.Boot.__toStr = {}.toString;
js.NodeC.UTF8 = "utf8";
js.NodeC.ASCII = "ascii";
js.NodeC.BINARY = "binary";
js.NodeC.BASE64 = "base64";
js.NodeC.HEX = "hex";
js.NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
js.NodeC.EVENT_EVENTEMITTER_ERROR = "error";
js.NodeC.EVENT_STREAM_DATA = "data";
js.NodeC.EVENT_STREAM_END = "end";
js.NodeC.EVENT_STREAM_ERROR = "error";
js.NodeC.EVENT_STREAM_CLOSE = "close";
js.NodeC.EVENT_STREAM_DRAIN = "drain";
js.NodeC.EVENT_STREAM_CONNECT = "connect";
js.NodeC.EVENT_STREAM_SECURE = "secure";
js.NodeC.EVENT_STREAM_TIMEOUT = "timeout";
js.NodeC.EVENT_STREAM_PIPE = "pipe";
js.NodeC.EVENT_PROCESS_EXIT = "exit";
js.NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
js.NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
js.NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
js.NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
js.NodeC.EVENT_HTTPSERVER_REQUEST = "request";
js.NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
js.NodeC.EVENT_HTTPSERVER_CLOSE = "close";
js.NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
js.NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
js.NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
js.NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
js.NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
js.NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
js.NodeC.EVENT_CLIENTRESPONSE_END = "end";
js.NodeC.EVENT_NETSERVER_CONNECTION = "connection";
js.NodeC.EVENT_NETSERVER_CLOSE = "close";
js.NodeC.FILE_READ = "r";
js.NodeC.FILE_READ_APPEND = "r+";
js.NodeC.FILE_WRITE = "w";
js.NodeC.FILE_WRITE_APPEND = "a+";
js.NodeC.FILE_READWRITE = "a";
js.NodeC.FILE_READWRITE_APPEND = "a+";
js.Node.console = console;
js.Node.process = process;
js.Node.require = require;
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.setImmediate = (function($this) {
	var $r;
	var version = HxOverrides.substr(js.Node.process.version,1,null).split(".").map(Std.parseInt);
	$r = version[0] > 0 || version[1] >= 9?js.Node.isNodeWebkit()?global.setImmediate:setImmediate:null;
	return $r;
}(this));
js.Node.clearImmediate = (function($this) {
	var $r;
	var version = HxOverrides.substr(js.Node.process.version,1,null).split(".").map(Std.parseInt);
	$r = version[0] > 0 || version[1] >= 9?js.Node.isNodeWebkit()?global.clearImmediate:clearImmediate:null;
	return $r;
}(this));
js.Node.global = global;
js.Node.module = js.Node.isNodeWebkit()?global.module:module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
saturn.app.SaturnServer.DEBUG = (js.Node.require("debug"))("saturn:server");
saturn.client.core.CommonCore.pools = new haxe.ds.StringMap();
saturn.client.core.CommonCore.resourceToPool = new haxe.ds.ObjectMap();
saturn.client.core.CommonCore.providers = new haxe.ds.StringMap();
saturn.core.molecule.Molecule.newLineReg = new EReg("\n","g");
saturn.core.molecule.Molecule.carLineReg = new EReg("\r","g");
saturn.core.molecule.Molecule.whiteSpaceReg = new EReg("\\s","g");
saturn.core.molecule.Molecule.reg_starReplace = new EReg("\\*","");
saturn.core.StandardGeneticCode.instance = new saturn.core.StandardGeneticCode();
saturn.core.StandardGeneticCode.standardTable = saturn.core.StandardGeneticCode.instance.getCodonLookupTable();
saturn.core.StandardGeneticCode.aaToCodon = saturn.core.StandardGeneticCode.instance.getAAToCodonTable();
saturn.core.GeneticCodeRegistry.CODE_REGISTRY = new saturn.core.GeneticCodeRegistry();
saturn.core.EUtils.eutils = js.Node.require("ncbi-eutils");
saturn.core.FastaEntity.DNA_CHARS = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	if(__map_reserved.A != null) _g.setReserved("A",true); else _g.h["A"] = true;
	if(__map_reserved.T != null) _g.setReserved("T",true); else _g.h["T"] = true;
	if(__map_reserved.G != null) _g.setReserved("G",true); else _g.h["G"] = true;
	if(__map_reserved.C != null) _g.setReserved("C",true); else _g.h["C"] = true;
	if(__map_reserved.X != null) _g.setReserved("X",true); else _g.h["X"] = true;
	if(__map_reserved.U != null) _g.setReserved("U",true); else _g.h["U"] = true;
	$r = _g;
	return $r;
}(this));
saturn.core.FastaEntity.headerPattern1 = new EReg("^>(.+)","");
saturn.core.Util.fs = js.Node.require("fs");
saturn.core.Util.temp = js.Node.require("temp");
saturn.core.Util.split = js.Node.require("split");
saturn.core.domain.Compound.molCache = new haxe.ds.StringMap();
saturn.core.domain.Compound.r = new EReg("svg:","g");
saturn.core.domain.Compound.rw = new EReg("width='300px'","g");
saturn.core.domain.Compound.rh = new EReg("height='300px'","g");
saturn.core.molecule.MoleculeConstants.aMW = 331.2;
saturn.core.molecule.MoleculeConstants.tMW = 322.2;
saturn.core.molecule.MoleculeConstants.gMW = 347.2;
saturn.core.molecule.MoleculeConstants.cMW = 307.2;
saturn.core.molecule.MoleculeConstants.aChainMW = 313.2;
saturn.core.molecule.MoleculeConstants.tChainMW = 304.2;
saturn.core.molecule.MoleculeConstants.gChainMW = 329.2;
saturn.core.molecule.MoleculeConstants.cChainMW = 289.2;
saturn.core.molecule.MoleculeConstants.O2H = 18.02;
saturn.core.molecule.MoleculeConstants.OH = 17.01;
saturn.core.molecule.MoleculeConstants.PO3 = 78.97;
saturn.core.molecule.MoleculeSetRegistry.defaultRegistry = new saturn.core.molecule.MoleculeSetRegistry();
saturn.db.DefaultProvider.r_date = new EReg("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.000Z","");
saturn.db.mapping.FamaPublic.models = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	{
		var value;
		var _g1 = new haxe.ds.StringMap();
		var value1;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g2.setReserved("path","PATH"); else _g2.h["path"] = "PATH";
		if(__map_reserved.content != null) _g2.setReserved("content","CONTENT"); else _g2.h["content"] = "CONTENT";
		value1 = _g2;
		if(__map_reserved.fields != null) _g1.setReserved("fields",value1); else _g1.h["fields"] = value1;
		var value2;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.path != null) _g3.setReserved("path",true); else _g3.h["path"] = true;
		value2 = _g3;
		if(__map_reserved.indexes != null) _g1.setReserved("indexes",value2); else _g1.h["indexes"] = value2;
		var value3;
		var _g4 = new haxe.ds.StringMap();
		var value4;
		var _g5 = new haxe.ds.StringMap();
		if(__map_reserved["/work"] != null) _g5.setReserved("/work","W:"); else _g5.h["/work"] = "W:";
		if(__map_reserved["/home/share"] != null) _g5.setReserved("/home/share","S:"); else _g5.h["/home/share"] = "S:";
		value4 = _g5;
		_g4.set("windows_conversions",value4);
		var value5;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g6.setReserved("WORK","^W"); else _g6.h["WORK"] = "^W";
		value5 = _g6;
		_g4.set("windows_allowed_paths_regex",value5);
		var value6;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved["W:"] != null) _g7.setReserved("W:","/work"); else _g7.h["W:"] = "/work";
		value6 = _g7;
		_g4.set("linux_conversions",value6);
		var value7;
		var _g8 = new haxe.ds.StringMap();
		if(__map_reserved.WORK != null) _g8.setReserved("WORK","^/work"); else _g8.h["WORK"] = "^/work";
		value7 = _g8;
		_g4.set("linux_allowed_paths_regex",value7);
		value3 = _g4;
		if(__map_reserved.options != null) _g1.setReserved("options",value3); else _g1.h["options"] = value3;
		value = _g1;
		if(__map_reserved["saturn.core.domain.FileProxy"] != null) _g.setReserved("saturn.core.domain.FileProxy",value); else _g.h["saturn.core.domain.FileProxy"] = value;
	}
	{
		var value8;
		var _g9 = new haxe.ds.StringMap();
		var value9;
		var _g10 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g10.setReserved("moleculeName","NAME"); else _g10.h["moleculeName"] = "NAME";
		value9 = _g10;
		if(__map_reserved.fields != null) _g9.setReserved("fields",value9); else _g9.h["fields"] = value9;
		var value10;
		var _g11 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g11.setReserved("moleculeName",true); else _g11.h["moleculeName"] = true;
		value10 = _g11;
		if(__map_reserved.indexes != null) _g9.setReserved("indexes",value10); else _g9.h["indexes"] = value10;
		var value11;
		var _g12 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g12.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g12.h["saturn.client.programs.DNASequenceEditor"] = true;
		value11 = _g12;
		if(__map_reserved.programs != null) _g9.setReserved("programs",value11); else _g9.h["programs"] = value11;
		var value12;
		var _g13 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g13.setReserved("alias","DNA"); else _g13.h["alias"] = "DNA";
		value12 = _g13;
		if(__map_reserved.options != null) _g9.setReserved("options",value12); else _g9.h["options"] = value12;
		value8 = _g9;
		if(__map_reserved["saturn.core.DNA"] != null) _g.setReserved("saturn.core.DNA",value8); else _g.h["saturn.core.DNA"] = value8;
	}
	{
		var value13;
		var _g14 = new haxe.ds.StringMap();
		var value14;
		var _g15 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g15.setReserved("moleculeName","NAME"); else _g15.h["moleculeName"] = "NAME";
		value14 = _g15;
		if(__map_reserved.fields != null) _g14.setReserved("fields",value14); else _g14.h["fields"] = value14;
		var value15;
		var _g16 = new haxe.ds.StringMap();
		if(__map_reserved.moleculeName != null) _g16.setReserved("moleculeName",true); else _g16.h["moleculeName"] = true;
		value15 = _g16;
		if(__map_reserved.indexes != null) _g14.setReserved("indexes",value15); else _g14.h["indexes"] = value15;
		var value16;
		var _g17 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g17.setReserved("saturn.client.programs.ProteinSequenceEditor",true); else _g17.h["saturn.client.programs.ProteinSequenceEditor"] = true;
		value16 = _g17;
		if(__map_reserved.programs != null) _g14.setReserved("programs",value16); else _g14.h["programs"] = value16;
		var value17;
		var _g18 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g18.setReserved("alias","Proteins"); else _g18.h["alias"] = "Proteins";
		value17 = _g18;
		if(__map_reserved.options != null) _g14.setReserved("options",value17); else _g14.h["options"] = value17;
		value13 = _g14;
		if(__map_reserved["saturn.core.Protein"] != null) _g.setReserved("saturn.core.Protein",value13); else _g.h["saturn.core.Protein"] = value13;
	}
	{
		var value18;
		var _g19 = new haxe.ds.StringMap();
		var value19;
		var _g20 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g20.setReserved("name","NAME"); else _g20.h["name"] = "NAME";
		value19 = _g20;
		if(__map_reserved.fields != null) _g19.setReserved("fields",value19); else _g19.h["fields"] = value19;
		var value20;
		var _g21 = new haxe.ds.StringMap();
		if(__map_reserved.name != null) _g21.setReserved("name",true); else _g21.h["name"] = true;
		value20 = _g21;
		if(__map_reserved.indexes != null) _g19.setReserved("indexes",value20); else _g19.h["indexes"] = value20;
		var value21;
		var _g22 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.TextEditor"] != null) _g22.setReserved("saturn.client.programs.TextEditor",true); else _g22.h["saturn.client.programs.TextEditor"] = true;
		value21 = _g22;
		if(__map_reserved.programs != null) _g19.setReserved("programs",value21); else _g19.h["programs"] = value21;
		var value22;
		var _g23 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g23.setReserved("alias","File"); else _g23.h["alias"] = "File";
		value22 = _g23;
		if(__map_reserved.options != null) _g19.setReserved("options",value22); else _g19.h["options"] = value22;
		value18 = _g19;
		if(__map_reserved["saturn.core.domain.TextFile"] != null) _g.setReserved("saturn.core.domain.TextFile",value18); else _g.h["saturn.core.domain.TextFile"] = value18;
	}
	{
		var value23;
		var _g24 = new haxe.ds.StringMap();
		var value24;
		var _g25 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.BasicTableViewer"] != null) _g25.setReserved("saturn.client.programs.BasicTableViewer",true); else _g25.h["saturn.client.programs.BasicTableViewer"] = true;
		value24 = _g25;
		if(__map_reserved.programs != null) _g24.setReserved("programs",value24); else _g24.h["programs"] = value24;
		var value25;
		var _g26 = new haxe.ds.StringMap();
		if(__map_reserved.alias != null) _g26.setReserved("alias","Results"); else _g26.h["alias"] = "Results";
		value25 = _g26;
		if(__map_reserved.options != null) _g24.setReserved("options",value25); else _g24.h["options"] = value25;
		value23 = _g24;
		if(__map_reserved["saturn.core.BasicTable"] != null) _g.setReserved("saturn.core.BasicTable",value23); else _g.h["saturn.core.BasicTable"] = value23;
	}
	{
		var value26;
		var _g27 = new haxe.ds.StringMap();
		var value27;
		var _g28 = new haxe.ds.StringMap();
		var value28;
		var _g29 = new haxe.ds.StringMap();
		if(__map_reserved.SGC != null) _g29.setReserved("SGC",true); else _g29.h["SGC"] = true;
		value28 = _g29;
		_g28.set("flags",value28);
		value27 = _g28;
		if(__map_reserved.options != null) _g27.setReserved("options",value27); else _g27.h["options"] = value27;
		value26 = _g27;
		if(__map_reserved["saturn.app.SaturnClient"] != null) _g.setReserved("saturn.app.SaturnClient",value26); else _g.h["saturn.app.SaturnClient"] = value26;
	}
	$r = _g;
	return $r;
}(this));
saturn.db.mapping.SQLiteMapping.models = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	{
		var value;
		var _g1 = new haxe.ds.StringMap();
		var value1;
		var _g2 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g2.setReserved("constructId","CONSTRUCT_ID"); else _g2.h["constructId"] = "CONSTRUCT_ID";
		if(__map_reserved.id != null) _g2.setReserved("id","PKEY"); else _g2.h["id"] = "PKEY";
		if(__map_reserved.proteinSeq != null) _g2.setReserved("proteinSeq","CONSTRUCTPROTSEQ"); else _g2.h["proteinSeq"] = "CONSTRUCTPROTSEQ";
		if(__map_reserved.proteinSeqNoTag != null) _g2.setReserved("proteinSeqNoTag","CONSTRUCTPROTSEQNOTAG"); else _g2.h["proteinSeqNoTag"] = "CONSTRUCTPROTSEQNOTAG";
		if(__map_reserved.dnaSeq != null) _g2.setReserved("dnaSeq","CONSTRUCTDNASEQ"); else _g2.h["dnaSeq"] = "CONSTRUCTDNASEQ";
		if(__map_reserved.docId != null) _g2.setReserved("docId","ELNEXP"); else _g2.h["docId"] = "ELNEXP";
		if(__map_reserved.vectorId != null) _g2.setReserved("vectorId","SGCVECTOR_PKEY"); else _g2.h["vectorId"] = "SGCVECTOR_PKEY";
		if(__map_reserved.alleleId != null) _g2.setReserved("alleleId","SGCALLELE_PKEY"); else _g2.h["alleleId"] = "SGCALLELE_PKEY";
		if(__map_reserved.res1Id != null) _g2.setReserved("res1Id","SGCRESTRICTENZ1_PKEY"); else _g2.h["res1Id"] = "SGCRESTRICTENZ1_PKEY";
		if(__map_reserved.res2Id != null) _g2.setReserved("res2Id","SGCRESTRICTENZ2_PKEY"); else _g2.h["res2Id"] = "SGCRESTRICTENZ2_PKEY";
		if(__map_reserved.constructPlateId != null) _g2.setReserved("constructPlateId","SGCCONSTRUCTPLATE_PKEY"); else _g2.h["constructPlateId"] = "SGCCONSTRUCTPLATE_PKEY";
		if(__map_reserved.wellId != null) _g2.setReserved("wellId","WELLID"); else _g2.h["wellId"] = "WELLID";
		if(__map_reserved.expectedMass != null) _g2.setReserved("expectedMass","EXPECTEDMASS"); else _g2.h["expectedMass"] = "EXPECTEDMASS";
		if(__map_reserved.expectedMassNoTag != null) _g2.setReserved("expectedMassNoTag","EXPETCEDMASSNOTAG"); else _g2.h["expectedMassNoTag"] = "EXPETCEDMASSNOTAG";
		if(__map_reserved.status != null) _g2.setReserved("status","STATUS"); else _g2.h["status"] = "STATUS";
		if(__map_reserved.location != null) _g2.setReserved("location","SGCLOCATION"); else _g2.h["location"] = "SGCLOCATION";
		if(__map_reserved.elnId != null) _g2.setReserved("elnId","ELNEXP"); else _g2.h["elnId"] = "ELNEXP";
		if(__map_reserved.constructComments != null) _g2.setReserved("constructComments","CONSTRUCTCOMMENTS"); else _g2.h["constructComments"] = "CONSTRUCTCOMMENTS";
		value1 = _g2;
		if(__map_reserved.fields != null) _g1.setReserved("fields",value1); else _g1.h["fields"] = value1;
		var value2;
		var _g3 = new haxe.ds.StringMap();
		if(__map_reserved.constructId != null) _g3.setReserved("constructId",false); else _g3.h["constructId"] = false;
		if(__map_reserved.id != null) _g3.setReserved("id",true); else _g3.h["id"] = true;
		value2 = _g3;
		if(__map_reserved.indexes != null) _g1.setReserved("indexes",value2); else _g1.h["indexes"] = value2;
		var value3;
		var _g4 = new haxe.ds.StringMap();
		if(__map_reserved["Construct ID"] != null) _g4.setReserved("Construct ID","constructId"); else _g4.h["Construct ID"] = "constructId";
		if(__map_reserved["Construct Plate"] != null) _g4.setReserved("Construct Plate","constructPlate.plateName"); else _g4.h["Construct Plate"] = "constructPlate.plateName";
		if(__map_reserved["Well ID"] != null) _g4.setReserved("Well ID","wellId"); else _g4.h["Well ID"] = "wellId";
		if(__map_reserved["Vector ID"] != null) _g4.setReserved("Vector ID","vector.vectorId"); else _g4.h["Vector ID"] = "vector.vectorId";
		if(__map_reserved["Allele ID"] != null) _g4.setReserved("Allele ID","allele.alleleId"); else _g4.h["Allele ID"] = "allele.alleleId";
		if(__map_reserved.Status != null) _g4.setReserved("Status","status"); else _g4.h["Status"] = "status";
		if(__map_reserved["Protein Sequence"] != null) _g4.setReserved("Protein Sequence","proteinSeq"); else _g4.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved["Expected Mass"] != null) _g4.setReserved("Expected Mass","expectedMass"); else _g4.h["Expected Mass"] = "expectedMass";
		if(__map_reserved["Restriction Site 1"] != null) _g4.setReserved("Restriction Site 1","res1.enzymeName"); else _g4.h["Restriction Site 1"] = "res1.enzymeName";
		if(__map_reserved["Restriction Site 2"] != null) _g4.setReserved("Restriction Site 2","res2.enzymeName"); else _g4.h["Restriction Site 2"] = "res2.enzymeName";
		if(__map_reserved["Protein Sequence (No Tag)"] != null) _g4.setReserved("Protein Sequence (No Tag)","proteinSeqNoTag"); else _g4.h["Protein Sequence (No Tag)"] = "proteinSeqNoTag";
		if(__map_reserved["Expected Mass (No Tag)"] != null) _g4.setReserved("Expected Mass (No Tag)","expectedMassNoTag"); else _g4.h["Expected Mass (No Tag)"] = "expectedMassNoTag";
		if(__map_reserved["Construct DNA Sequence"] != null) _g4.setReserved("Construct DNA Sequence","dnaSeq"); else _g4.h["Construct DNA Sequence"] = "dnaSeq";
		if(__map_reserved.Location != null) _g4.setReserved("Location","location"); else _g4.h["Location"] = "location";
		if(__map_reserved["ELN ID"] != null) _g4.setReserved("ELN ID","elnId"); else _g4.h["ELN ID"] = "elnId";
		if(__map_reserved["Construct Comments"] != null) _g4.setReserved("Construct Comments","constructComments"); else _g4.h["Construct Comments"] = "constructComments";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g4.setReserved("__HIDDEN__PKEY__","id"); else _g4.h["__HIDDEN__PKEY__"] = "id";
		value3 = _g4;
		if(__map_reserved.model != null) _g1.setReserved("model",value3); else _g1.h["model"] = value3;
		var value4;
		var _g5 = new haxe.ds.StringMap();
		var value5;
		var _g6 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g6.setReserved("field","alleleId"); else _g6.h["field"] = "alleleId";
		if(__map_reserved["class"] != null) _g6.setReserved("class","saturn.core.domain.SgcAllele"); else _g6.h["class"] = "saturn.core.domain.SgcAllele";
		if(__map_reserved.fk_field != null) _g6.setReserved("fk_field","id"); else _g6.h["fk_field"] = "id";
		value5 = _g6;
		_g5.set("allele",value5);
		var value6;
		var _g7 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g7.setReserved("field","vectorId"); else _g7.h["field"] = "vectorId";
		if(__map_reserved["class"] != null) _g7.setReserved("class","saturn.core.domain.SgcVector"); else _g7.h["class"] = "saturn.core.domain.SgcVector";
		if(__map_reserved.fk_field != null) _g7.setReserved("fk_field","Id"); else _g7.h["fk_field"] = "Id";
		value6 = _g7;
		_g5.set("vector",value6);
		var value7;
		var _g8 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g8.setReserved("field","res1Id"); else _g8.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g8.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g8.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g8.setReserved("fk_field","id"); else _g8.h["fk_field"] = "id";
		value7 = _g8;
		_g5.set("res1",value7);
		var value8;
		var _g9 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g9.setReserved("field","res2Id"); else _g9.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g9.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g9.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g9.setReserved("fk_field","id"); else _g9.h["fk_field"] = "id";
		value8 = _g9;
		_g5.set("res2",value8);
		var value9;
		var _g10 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g10.setReserved("field","constructPlateId"); else _g10.h["field"] = "constructPlateId";
		if(__map_reserved["class"] != null) _g10.setReserved("class","saturn.core.domain.SgcConstructPlate"); else _g10.h["class"] = "saturn.core.domain.SgcConstructPlate";
		if(__map_reserved.fk_field != null) _g10.setReserved("fk_field","id"); else _g10.h["fk_field"] = "id";
		value9 = _g10;
		_g5.set("constructPlate",value9);
		value4 = _g5;
		if(__map_reserved["fields.synthetic"] != null) _g1.setReserved("fields.synthetic",value4); else _g1.h["fields.synthetic"] = value4;
		var value10;
		var _g11 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g11.setReserved("schema","SGC"); else _g11.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g11.setReserved("name","CONSTRUCT"); else _g11.h["name"] = "CONSTRUCT";
		value10 = _g11;
		if(__map_reserved.table_info != null) _g1.setReserved("table_info",value10); else _g1.h["table_info"] = value10;
		value = _g1;
		if(__map_reserved["saturn.core.domain.SgcConstruct"] != null) _g.setReserved("saturn.core.domain.SgcConstruct",value); else _g.h["saturn.core.domain.SgcConstruct"] = value;
	}
	{
		var value11;
		var _g12 = new haxe.ds.StringMap();
		var value12;
		var _g13 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g13.setReserved("alleleId","ALLELE_ID"); else _g13.h["alleleId"] = "ALLELE_ID";
		if(__map_reserved.allelePlateId != null) _g13.setReserved("allelePlateId","SGCPLATE_PKEY"); else _g13.h["allelePlateId"] = "SGCPLATE_PKEY";
		if(__map_reserved.id != null) _g13.setReserved("id","PKEY"); else _g13.h["id"] = "PKEY";
		if(__map_reserved.entryCloneId != null) _g13.setReserved("entryCloneId","SGCENTRYCLONE_PKEY"); else _g13.h["entryCloneId"] = "SGCENTRYCLONE_PKEY";
		if(__map_reserved.forwardPrimerId != null) _g13.setReserved("forwardPrimerId","SGCPRIMER5_PKEY"); else _g13.h["forwardPrimerId"] = "SGCPRIMER5_PKEY";
		if(__map_reserved.reversePrimerId != null) _g13.setReserved("reversePrimerId","SGCPRIMER3_PKEY"); else _g13.h["reversePrimerId"] = "SGCPRIMER3_PKEY";
		if(__map_reserved.dnaSeq != null) _g13.setReserved("dnaSeq","ALLELESEQUENCERAW"); else _g13.h["dnaSeq"] = "ALLELESEQUENCERAW";
		if(__map_reserved.proteinSeq != null) _g13.setReserved("proteinSeq","ALLELEPROTSEQ"); else _g13.h["proteinSeq"] = "ALLELEPROTSEQ";
		if(__map_reserved.status != null) _g13.setReserved("status","ALLELE_STATUS"); else _g13.h["status"] = "ALLELE_STATUS";
		if(__map_reserved.location != null) _g13.setReserved("location","SGCLOCATION"); else _g13.h["location"] = "SGCLOCATION";
		if(__map_reserved.comments != null) _g13.setReserved("comments","ALLELECOMMENTS"); else _g13.h["comments"] = "ALLELECOMMENTS";
		if(__map_reserved.elnId != null) _g13.setReserved("elnId","ELNEXP"); else _g13.h["elnId"] = "ELNEXP";
		if(__map_reserved.dateStamp != null) _g13.setReserved("dateStamp","DATESTAMP"); else _g13.h["dateStamp"] = "DATESTAMP";
		if(__map_reserved.person != null) _g13.setReserved("person","PERSON"); else _g13.h["person"] = "PERSON";
		if(__map_reserved.plateWell != null) _g13.setReserved("plateWell","PLATEWELL"); else _g13.h["plateWell"] = "PLATEWELL";
		if(__map_reserved.dnaSeqLen != null) _g13.setReserved("dnaSeqLen","ALLELESEQLENGTH"); else _g13.h["dnaSeqLen"] = "ALLELESEQLENGTH";
		if(__map_reserved.complex != null) _g13.setReserved("complex","COMPLEX"); else _g13.h["complex"] = "COMPLEX";
		if(__map_reserved.domainSummary != null) _g13.setReserved("domainSummary","DOMAINSUMMARY"); else _g13.h["domainSummary"] = "DOMAINSUMMARY";
		if(__map_reserved.domainStartDelta != null) _g13.setReserved("domainStartDelta","DOMAINSTARTDELTA"); else _g13.h["domainStartDelta"] = "DOMAINSTARTDELTA";
		if(__map_reserved.domainStopDelta != null) _g13.setReserved("domainStopDelta","DOMAINSTOPDELTA"); else _g13.h["domainStopDelta"] = "DOMAINSTOPDELTA";
		if(__map_reserved.containsPharmaDomain != null) _g13.setReserved("containsPharmaDomain","CONTAINSPHARMADOMAIN"); else _g13.h["containsPharmaDomain"] = "CONTAINSPHARMADOMAIN";
		if(__map_reserved.domainSummaryLong != null) _g13.setReserved("domainSummaryLong","DOMAINSUMMARYLONG"); else _g13.h["domainSummaryLong"] = "DOMAINSUMMARYLONG";
		if(__map_reserved.impPI != null) _g13.setReserved("impPI","IMPPI"); else _g13.h["impPI"] = "IMPPI";
		value12 = _g13;
		if(__map_reserved.fields != null) _g12.setReserved("fields",value12); else _g12.h["fields"] = value12;
		var value13;
		var _g14 = new haxe.ds.StringMap();
		if(__map_reserved.status != null) _g14.setReserved("status","In process"); else _g14.h["status"] = "In process";
		value13 = _g14;
		if(__map_reserved.defaults != null) _g12.setReserved("defaults",value13); else _g12.h["defaults"] = value13;
		var value14;
		var _g15 = new haxe.ds.StringMap();
		if(__map_reserved["Allele ID"] != null) _g15.setReserved("Allele ID","alleleId"); else _g15.h["Allele ID"] = "alleleId";
		if(__map_reserved.Plate != null) _g15.setReserved("Plate","plate.plateName"); else _g15.h["Plate"] = "plate.plateName";
		if(__map_reserved["Entry Clone ID"] != null) _g15.setReserved("Entry Clone ID","entryClone.entryCloneId"); else _g15.h["Entry Clone ID"] = "entryClone.entryCloneId";
		if(__map_reserved["Forward Primer ID"] != null) _g15.setReserved("Forward Primer ID","forwardPrimer.primerId"); else _g15.h["Forward Primer ID"] = "forwardPrimer.primerId";
		if(__map_reserved["Reverse Primer ID"] != null) _g15.setReserved("Reverse Primer ID","reversePrimer.primerId"); else _g15.h["Reverse Primer ID"] = "reversePrimer.primerId";
		if(__map_reserved["DNA Sequence"] != null) _g15.setReserved("DNA Sequence","dnaSeq"); else _g15.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved["Protein Sequence"] != null) _g15.setReserved("Protein Sequence","proteinSeq"); else _g15.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.Status != null) _g15.setReserved("Status","status"); else _g15.h["Status"] = "status";
		if(__map_reserved.Location != null) _g15.setReserved("Location","location"); else _g15.h["Location"] = "location";
		if(__map_reserved.Comments != null) _g15.setReserved("Comments","comments"); else _g15.h["Comments"] = "comments";
		if(__map_reserved["ELN ID"] != null) _g15.setReserved("ELN ID","elnId"); else _g15.h["ELN ID"] = "elnId";
		if(__map_reserved["Date Record"] != null) _g15.setReserved("Date Record","dateStamp"); else _g15.h["Date Record"] = "dateStamp";
		if(__map_reserved.Person != null) _g15.setReserved("Person","person"); else _g15.h["Person"] = "person";
		if(__map_reserved["Plate Well"] != null) _g15.setReserved("Plate Well","plateWell"); else _g15.h["Plate Well"] = "plateWell";
		if(__map_reserved["DNA Length"] != null) _g15.setReserved("DNA Length","dnaSeqLen"); else _g15.h["DNA Length"] = "dnaSeqLen";
		if(__map_reserved.Complex != null) _g15.setReserved("Complex","complex"); else _g15.h["Complex"] = "complex";
		if(__map_reserved["Domain Summary"] != null) _g15.setReserved("Domain Summary","domainSummary"); else _g15.h["Domain Summary"] = "domainSummary";
		if(__map_reserved["Domain  Start Delta"] != null) _g15.setReserved("Domain  Start Delta","domainStartDelta"); else _g15.h["Domain  Start Delta"] = "domainStartDelta";
		if(__map_reserved["Domain Stop Delta"] != null) _g15.setReserved("Domain Stop Delta","domainStopDelta"); else _g15.h["Domain Stop Delta"] = "domainStopDelta";
		if(__map_reserved["Contains Pharma Domain"] != null) _g15.setReserved("Contains Pharma Domain","containsPharmaDomain"); else _g15.h["Contains Pharma Domain"] = "containsPharmaDomain";
		if(__map_reserved["Domain Summary Long"] != null) _g15.setReserved("Domain Summary Long","domainSummaryLong"); else _g15.h["Domain Summary Long"] = "domainSummaryLong";
		if(__map_reserved["IMP PI"] != null) _g15.setReserved("IMP PI","impPI"); else _g15.h["IMP PI"] = "impPI";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g15.setReserved("__HIDDEN__PKEY__","id"); else _g15.h["__HIDDEN__PKEY__"] = "id";
		value14 = _g15;
		if(__map_reserved.model != null) _g12.setReserved("model",value14); else _g12.h["model"] = value14;
		var value15;
		var _g16 = new haxe.ds.StringMap();
		if(__map_reserved.alleleId != null) _g16.setReserved("alleleId",false); else _g16.h["alleleId"] = false;
		if(__map_reserved.id != null) _g16.setReserved("id",true); else _g16.h["id"] = true;
		value15 = _g16;
		if(__map_reserved.indexes != null) _g12.setReserved("indexes",value15); else _g12.h["indexes"] = value15;
		var value16;
		var _g17 = new haxe.ds.StringMap();
		var value17;
		var _g18 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g18.setReserved("field","entryCloneId"); else _g18.h["field"] = "entryCloneId";
		if(__map_reserved["class"] != null) _g18.setReserved("class","saturn.core.domain.SgcEntryClone"); else _g18.h["class"] = "saturn.core.domain.SgcEntryClone";
		if(__map_reserved.fk_field != null) _g18.setReserved("fk_field","id"); else _g18.h["fk_field"] = "id";
		value17 = _g18;
		_g17.set("entryClone",value17);
		var value18;
		var _g19 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g19.setReserved("field","forwardPrimerId"); else _g19.h["field"] = "forwardPrimerId";
		if(__map_reserved["class"] != null) _g19.setReserved("class","saturn.core.domain.SgcForwardPrimer"); else _g19.h["class"] = "saturn.core.domain.SgcForwardPrimer";
		if(__map_reserved.fk_field != null) _g19.setReserved("fk_field","id"); else _g19.h["fk_field"] = "id";
		value18 = _g19;
		_g17.set("forwardPrimer",value18);
		var value19;
		var _g20 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g20.setReserved("field","reversePrimerId"); else _g20.h["field"] = "reversePrimerId";
		if(__map_reserved["class"] != null) _g20.setReserved("class","saturn.core.domain.SgcReversePrimer"); else _g20.h["class"] = "saturn.core.domain.SgcReversePrimer";
		if(__map_reserved.fk_field != null) _g20.setReserved("fk_field","id"); else _g20.h["fk_field"] = "id";
		value19 = _g20;
		_g17.set("reversePrimer",value19);
		var value20;
		var _g21 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g21.setReserved("field","allelePlateId"); else _g21.h["field"] = "allelePlateId";
		if(__map_reserved["class"] != null) _g21.setReserved("class","saturn.core.domain.SgcAllelePlate"); else _g21.h["class"] = "saturn.core.domain.SgcAllelePlate";
		if(__map_reserved.fk_field != null) _g21.setReserved("fk_field","id"); else _g21.h["fk_field"] = "id";
		value20 = _g21;
		_g17.set("plate",value20);
		value16 = _g17;
		if(__map_reserved["fields.synthetic"] != null) _g12.setReserved("fields.synthetic",value16); else _g12.h["fields.synthetic"] = value16;
		var value21;
		var _g22 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g22.setReserved("schema","SGC"); else _g22.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g22.setReserved("name","ALLELE"); else _g22.h["name"] = "ALLELE";
		value21 = _g22;
		if(__map_reserved.table_info != null) _g12.setReserved("table_info",value21); else _g12.h["table_info"] = value21;
		value11 = _g12;
		if(__map_reserved["saturn.core.domain.SgcAllele"] != null) _g.setReserved("saturn.core.domain.SgcAllele",value11); else _g.h["saturn.core.domain.SgcAllele"] = value11;
	}
	{
		var value22;
		var _g23 = new haxe.ds.StringMap();
		var value23;
		var _g24 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g24.setReserved("enzymeName","RESTRICTION_ENZYME_NAME"); else _g24.h["enzymeName"] = "RESTRICTION_ENZYME_NAME";
		if(__map_reserved.cutSequence != null) _g24.setReserved("cutSequence","RESTRICTION_ENZYME_SEQUENCERAW"); else _g24.h["cutSequence"] = "RESTRICTION_ENZYME_SEQUENCERAW";
		if(__map_reserved.id != null) _g24.setReserved("id","PKEY"); else _g24.h["id"] = "PKEY";
		value23 = _g24;
		if(__map_reserved.fields != null) _g23.setReserved("fields",value23); else _g23.h["fields"] = value23;
		var value24;
		var _g25 = new haxe.ds.StringMap();
		if(__map_reserved.enzymeName != null) _g25.setReserved("enzymeName",false); else _g25.h["enzymeName"] = false;
		if(__map_reserved.id != null) _g25.setReserved("id",true); else _g25.h["id"] = true;
		value24 = _g25;
		if(__map_reserved.indexes != null) _g23.setReserved("indexes",value24); else _g23.h["indexes"] = value24;
		var value25;
		var _g26 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g26.setReserved("schema","SGC"); else _g26.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g26.setReserved("name","RESTRICTION_ENZYME"); else _g26.h["name"] = "RESTRICTION_ENZYME";
		value25 = _g26;
		if(__map_reserved.table_info != null) _g23.setReserved("table_info",value25); else _g23.h["table_info"] = value25;
		value22 = _g23;
		if(__map_reserved["saturn.core.domain.SgcRestrictionSite"] != null) _g.setReserved("saturn.core.domain.SgcRestrictionSite",value22); else _g.h["saturn.core.domain.SgcRestrictionSite"] = value22;
	}
	{
		var value26;
		var _g27 = new haxe.ds.StringMap();
		var value27;
		var _g28 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g28.setReserved("vectorId","VECTOR_NAME"); else _g28.h["vectorId"] = "VECTOR_NAME";
		if(__map_reserved.Id != null) _g28.setReserved("Id","PKEY"); else _g28.h["Id"] = "PKEY";
		if(__map_reserved.vectorSequence != null) _g28.setReserved("vectorSequence","VECTORSEQUENCERAW"); else _g28.h["vectorSequence"] = "VECTORSEQUENCERAW";
		if(__map_reserved.vectorComments != null) _g28.setReserved("vectorComments","VECTORCOMMENTS"); else _g28.h["vectorComments"] = "VECTORCOMMENTS";
		if(__map_reserved.proteaseName != null) _g28.setReserved("proteaseName","PROTEASE_NAME"); else _g28.h["proteaseName"] = "PROTEASE_NAME";
		if(__map_reserved.proteaseCutSequence != null) _g28.setReserved("proteaseCutSequence","PROTEASE_CUTSEQUENCE"); else _g28.h["proteaseCutSequence"] = "PROTEASE_CUTSEQUENCE";
		if(__map_reserved.proteaseProduct != null) _g28.setReserved("proteaseProduct","PROTEASE_PRODUCT"); else _g28.h["proteaseProduct"] = "PROTEASE_PRODUCT";
		if(__map_reserved.antibiotic != null) _g28.setReserved("antibiotic","ANTIBIOTIC"); else _g28.h["antibiotic"] = "ANTIBIOTIC";
		if(__map_reserved.organism != null) _g28.setReserved("organism","ORGANISM"); else _g28.h["organism"] = "ORGANISM";
		if(__map_reserved.res1Id != null) _g28.setReserved("res1Id","SGCRESTRICTENZ1_PKEY"); else _g28.h["res1Id"] = "SGCRESTRICTENZ1_PKEY";
		if(__map_reserved.res2Id != null) _g28.setReserved("res2Id","SGCRESTRICTENZ2_PKEY"); else _g28.h["res2Id"] = "SGCRESTRICTENZ2_PKEY";
		value27 = _g28;
		if(__map_reserved.fields != null) _g27.setReserved("fields",value27); else _g27.h["fields"] = value27;
		var value28;
		var _g29 = new haxe.ds.StringMap();
		if(__map_reserved.vectorId != null) _g29.setReserved("vectorId",false); else _g29.h["vectorId"] = false;
		if(__map_reserved.Id != null) _g29.setReserved("Id",true); else _g29.h["Id"] = true;
		value28 = _g29;
		if(__map_reserved.indexes != null) _g27.setReserved("indexes",value28); else _g27.h["indexes"] = value28;
		var value29;
		var _g30 = new haxe.ds.StringMap();
		var value30;
		var _g31 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g31.setReserved("field","res1Id"); else _g31.h["field"] = "res1Id";
		if(__map_reserved["class"] != null) _g31.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g31.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g31.setReserved("fk_field","id"); else _g31.h["fk_field"] = "id";
		value30 = _g31;
		_g30.set("res1",value30);
		var value31;
		var _g32 = new haxe.ds.StringMap();
		if(__map_reserved.field != null) _g32.setReserved("field","res2Id"); else _g32.h["field"] = "res2Id";
		if(__map_reserved["class"] != null) _g32.setReserved("class","saturn.core.domain.SgcRestrictionSite"); else _g32.h["class"] = "saturn.core.domain.SgcRestrictionSite";
		if(__map_reserved.fk_field != null) _g32.setReserved("fk_field","id"); else _g32.h["fk_field"] = "id";
		value31 = _g32;
		_g30.set("res2",value31);
		value29 = _g30;
		if(__map_reserved["fields.synthetic"] != null) _g27.setReserved("fields.synthetic",value29); else _g27.h["fields.synthetic"] = value29;
		var value32;
		var _g33 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g33.setReserved("schema","SGC"); else _g33.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g33.setReserved("name","VECTOR"); else _g33.h["name"] = "VECTOR";
		value32 = _g33;
		if(__map_reserved.table_info != null) _g27.setReserved("table_info",value32); else _g27.h["table_info"] = value32;
		value26 = _g27;
		if(__map_reserved["saturn.core.domain.SgcVector"] != null) _g.setReserved("saturn.core.domain.SgcVector",value26); else _g.h["saturn.core.domain.SgcVector"] = value26;
	}
	{
		var value33;
		var _g34 = new haxe.ds.StringMap();
		var value34;
		var _g35 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g35.setReserved("primerId","PRIMERNAME"); else _g35.h["primerId"] = "PRIMERNAME";
		if(__map_reserved.id != null) _g35.setReserved("id","PKEY"); else _g35.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g35.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g35.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		value34 = _g35;
		if(__map_reserved.fields != null) _g34.setReserved("fields",value34); else _g34.h["fields"] = value34;
		var value35;
		var _g36 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g36.setReserved("primerId",false); else _g36.h["primerId"] = false;
		if(__map_reserved.id != null) _g36.setReserved("id",true); else _g36.h["id"] = true;
		value35 = _g36;
		if(__map_reserved.indexes != null) _g34.setReserved("indexes",value35); else _g34.h["indexes"] = value35;
		var value36;
		var _g37 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g37.setReserved("schema","SGC"); else _g37.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g37.setReserved("name","PRIMER"); else _g37.h["name"] = "PRIMER";
		value36 = _g37;
		if(__map_reserved.table_info != null) _g34.setReserved("table_info",value36); else _g34.h["table_info"] = value36;
		value33 = _g34;
		if(__map_reserved["saturn.core.domain.SgcForwardPrimer"] != null) _g.setReserved("saturn.core.domain.SgcForwardPrimer",value33); else _g.h["saturn.core.domain.SgcForwardPrimer"] = value33;
	}
	{
		var value37;
		var _g38 = new haxe.ds.StringMap();
		var value38;
		var _g39 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g39.setReserved("primerId","PRIMERNAME"); else _g39.h["primerId"] = "PRIMERNAME";
		if(__map_reserved.id != null) _g39.setReserved("id","PKEY"); else _g39.h["id"] = "PKEY";
		if(__map_reserved.dnaSequence != null) _g39.setReserved("dnaSequence","PRIMERRAWSEQUENCE"); else _g39.h["dnaSequence"] = "PRIMERRAWSEQUENCE";
		value38 = _g39;
		if(__map_reserved.fields != null) _g38.setReserved("fields",value38); else _g38.h["fields"] = value38;
		var value39;
		var _g40 = new haxe.ds.StringMap();
		if(__map_reserved.primerId != null) _g40.setReserved("primerId",false); else _g40.h["primerId"] = false;
		if(__map_reserved.id != null) _g40.setReserved("id",true); else _g40.h["id"] = true;
		value39 = _g40;
		if(__map_reserved.indexes != null) _g38.setReserved("indexes",value39); else _g38.h["indexes"] = value39;
		var value40;
		var _g41 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g41.setReserved("schema","SGC"); else _g41.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g41.setReserved("name","PRIMERREV"); else _g41.h["name"] = "PRIMERREV";
		value40 = _g41;
		if(__map_reserved.table_info != null) _g38.setReserved("table_info",value40); else _g38.h["table_info"] = value40;
		value37 = _g38;
		if(__map_reserved["saturn.core.domain.SgcReversePrimer"] != null) _g.setReserved("saturn.core.domain.SgcReversePrimer",value37); else _g.h["saturn.core.domain.SgcReversePrimer"] = value37;
	}
	{
		var value41;
		var _g42 = new haxe.ds.StringMap();
		var value42;
		var _g43 = new haxe.ds.StringMap();
		if(__map_reserved.sequence != null) _g43.setReserved("sequence","SEQ"); else _g43.h["sequence"] = "SEQ";
		if(__map_reserved.id != null) _g43.setReserved("id","PKEY"); else _g43.h["id"] = "PKEY";
		if(__map_reserved.type != null) _g43.setReserved("type","SEQTYPE"); else _g43.h["type"] = "SEQTYPE";
		if(__map_reserved.version != null) _g43.setReserved("version","TARGETVERSION"); else _g43.h["version"] = "TARGETVERSION";
		if(__map_reserved.targetId != null) _g43.setReserved("targetId","SGCTARGET_PKEY"); else _g43.h["targetId"] = "SGCTARGET_PKEY";
		if(__map_reserved.crc != null) _g43.setReserved("crc","CRC"); else _g43.h["crc"] = "CRC";
		if(__map_reserved.target != null) _g43.setReserved("target","TARGET_ID"); else _g43.h["target"] = "TARGET_ID";
		value42 = _g43;
		if(__map_reserved.fields != null) _g42.setReserved("fields",value42); else _g42.h["fields"] = value42;
		var value43;
		var _g44 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g44.setReserved("id",true); else _g44.h["id"] = true;
		value43 = _g44;
		if(__map_reserved.indexes != null) _g42.setReserved("indexes",value43); else _g42.h["indexes"] = value43;
		var value44;
		var _g45 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g45.setReserved("schema",""); else _g45.h["schema"] = "";
		if(__map_reserved.name != null) _g45.setReserved("name","SEQDATA"); else _g45.h["name"] = "SEQDATA";
		value44 = _g45;
		if(__map_reserved.table_info != null) _g42.setReserved("table_info",value44); else _g42.h["table_info"] = value44;
		value41 = _g42;
		if(__map_reserved["saturn.core.domain.SgcSeqData"] != null) _g.setReserved("saturn.core.domain.SgcSeqData",value41); else _g.h["saturn.core.domain.SgcSeqData"] = value41;
	}
	{
		var value45;
		var _g46 = new haxe.ds.StringMap();
		var value46;
		var _g47 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g47.setReserved("id","PKEY"); else _g47.h["id"] = "PKEY";
		if(__map_reserved.accession != null) _g47.setReserved("accession","IDENTIFIER"); else _g47.h["accession"] = "IDENTIFIER";
		if(__map_reserved.start != null) _g47.setReserved("start","SEQSTART"); else _g47.h["start"] = "SEQSTART";
		if(__map_reserved.stop != null) _g47.setReserved("stop","SEQSTOP"); else _g47.h["stop"] = "SEQSTOP";
		if(__map_reserved.targetId != null) _g47.setReserved("targetId","SGCTARGET_PKEY"); else _g47.h["targetId"] = "SGCTARGET_PKEY";
		value46 = _g47;
		if(__map_reserved.fields != null) _g46.setReserved("fields",value46); else _g46.h["fields"] = value46;
		var value47;
		var _g48 = new haxe.ds.StringMap();
		if(__map_reserved.accession != null) _g48.setReserved("accession",false); else _g48.h["accession"] = false;
		if(__map_reserved.id != null) _g48.setReserved("id",true); else _g48.h["id"] = true;
		value47 = _g48;
		if(__map_reserved.indexes != null) _g46.setReserved("indexes",value47); else _g46.h["indexes"] = value47;
		value45 = _g46;
		if(__map_reserved["saturn.core.domain.SgcDomain"] != null) _g.setReserved("saturn.core.domain.SgcDomain",value45); else _g.h["saturn.core.domain.SgcDomain"] = value45;
	}
	{
		var value48;
		var _g49 = new haxe.ds.StringMap();
		var value49;
		var _g50 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g50.setReserved("id","PKEY"); else _g50.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g50.setReserved("plateName","PLATENAME"); else _g50.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g50.setReserved("elnRef","ELNREF"); else _g50.h["elnRef"] = "ELNREF";
		value49 = _g50;
		if(__map_reserved.fields != null) _g49.setReserved("fields",value49); else _g49.h["fields"] = value49;
		var value50;
		var _g51 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g51.setReserved("plateName",false); else _g51.h["plateName"] = false;
		if(__map_reserved.id != null) _g51.setReserved("id",true); else _g51.h["id"] = true;
		value50 = _g51;
		if(__map_reserved.indexes != null) _g49.setReserved("indexes",value50); else _g49.h["indexes"] = value50;
		var value51;
		var _g52 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g52.setReserved("schema","SGC"); else _g52.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g52.setReserved("name","CONSTRUCTPLATE"); else _g52.h["name"] = "CONSTRUCTPLATE";
		value51 = _g52;
		if(__map_reserved.table_info != null) _g49.setReserved("table_info",value51); else _g49.h["table_info"] = value51;
		value48 = _g49;
		if(__map_reserved["saturn.core.domain.SgcConstructPlate"] != null) _g.setReserved("saturn.core.domain.SgcConstructPlate",value48); else _g.h["saturn.core.domain.SgcConstructPlate"] = value48;
	}
	{
		var value52;
		var _g53 = new haxe.ds.StringMap();
		var value53;
		var _g54 = new haxe.ds.StringMap();
		if(__map_reserved.id != null) _g54.setReserved("id","PKEY"); else _g54.h["id"] = "PKEY";
		if(__map_reserved.plateName != null) _g54.setReserved("plateName","PLATENAME"); else _g54.h["plateName"] = "PLATENAME";
		if(__map_reserved.elnRef != null) _g54.setReserved("elnRef","ELNREF"); else _g54.h["elnRef"] = "ELNREF";
		value53 = _g54;
		if(__map_reserved.fields != null) _g53.setReserved("fields",value53); else _g53.h["fields"] = value53;
		var value54;
		var _g55 = new haxe.ds.StringMap();
		if(__map_reserved.plateName != null) _g55.setReserved("plateName",false); else _g55.h["plateName"] = false;
		if(__map_reserved.id != null) _g55.setReserved("id",true); else _g55.h["id"] = true;
		value54 = _g55;
		if(__map_reserved.indexes != null) _g53.setReserved("indexes",value54); else _g53.h["indexes"] = value54;
		var value55;
		var _g56 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g56.setReserved("schema","SGC"); else _g56.h["schema"] = "SGC";
		if(__map_reserved.name != null) _g56.setReserved("name","PLATE"); else _g56.h["name"] = "PLATE";
		value55 = _g56;
		if(__map_reserved.table_info != null) _g53.setReserved("table_info",value55); else _g53.h["table_info"] = value55;
		value52 = _g53;
		if(__map_reserved["saturn.core.domain.SgcAllelePlate"] != null) _g.setReserved("saturn.core.domain.SgcAllelePlate",value52); else _g.h["saturn.core.domain.SgcAllelePlate"] = value52;
	}
	{
		var value56;
		var _g57 = new haxe.ds.StringMap();
		var value57;
		var _g58 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g58.setReserved("targetId","SEQUENCE_ID"); else _g58.h["targetId"] = "SEQUENCE_ID";
		if(__map_reserved.id != null) _g58.setReserved("id","PKEY"); else _g58.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g58.setReserved("dnaSeq","DNA_SEQ"); else _g58.h["dnaSeq"] = "DNA_SEQ";
		if(__map_reserved.proteinSeq != null) _g58.setReserved("proteinSeq","PROTEIN_SEQ"); else _g58.h["proteinSeq"] = "PROTEIN_SEQ";
		value57 = _g58;
		if(__map_reserved.fields != null) _g57.setReserved("fields",value57); else _g57.h["fields"] = value57;
		var value58;
		var _g59 = new haxe.ds.StringMap();
		if(__map_reserved.targetId != null) _g59.setReserved("targetId",false); else _g59.h["targetId"] = false;
		if(__map_reserved.id != null) _g59.setReserved("id",true); else _g59.h["id"] = true;
		value58 = _g59;
		if(__map_reserved.indexes != null) _g57.setReserved("indexes",value58); else _g57.h["indexes"] = value58;
		var value59;
		var _g60 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g60.setReserved("schema",""); else _g60.h["schema"] = "";
		if(__map_reserved.name != null) _g60.setReserved("name","DNA"); else _g60.h["name"] = "DNA";
		value59 = _g60;
		if(__map_reserved.table_info != null) _g57.setReserved("table_info",value59); else _g57.h["table_info"] = value59;
		var value60;
		var _g61 = new haxe.ds.StringMap();
		if(__map_reserved.ID != null) _g61.setReserved("ID","targetId"); else _g61.h["ID"] = "targetId";
		if(__map_reserved["DNA Sequence"] != null) _g61.setReserved("DNA Sequence","dnaSeq"); else _g61.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved["Protein Sequence"] != null) _g61.setReserved("Protein Sequence","proteinSeq"); else _g61.h["Protein Sequence"] = "proteinSeq";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g61.setReserved("__HIDDEN__PKEY__","id"); else _g61.h["__HIDDEN__PKEY__"] = "id";
		value60 = _g61;
		if(__map_reserved.model != null) _g57.setReserved("model",value60); else _g57.h["model"] = value60;
		var value61;
		var _g62 = new haxe.ds.StringMap();
		if(__map_reserved.polymorph_key != null) _g62.setReserved("polymorph_key","POLYMORPH_TYPE"); else _g62.h["polymorph_key"] = "POLYMORPH_TYPE";
		if(__map_reserved.value != null) _g62.setReserved("value","TARGET"); else _g62.h["value"] = "TARGET";
		value61 = _g62;
		if(__map_reserved.selector != null) _g57.setReserved("selector",value61); else _g57.h["selector"] = value61;
		var value62;
		var _g63 = new haxe.ds.StringMap();
		var value63;
		var _g64 = new haxe.ds.StringMap();
		if(__map_reserved["saturn.client.programs.DNASequenceEditor"] != null) _g64.setReserved("saturn.client.programs.DNASequenceEditor",true); else _g64.h["saturn.client.programs.DNASequenceEditor"] = true;
		if(__map_reserved["saturn.client.programs.ProteinSequenceEditor"] != null) _g64.setReserved("saturn.client.programs.ProteinSequenceEditor",true); else _g64.h["saturn.client.programs.ProteinSequenceEditor"] = true;
		value63 = _g64;
		_g63.set("canSave",value63);
		value62 = _g63;
		if(__map_reserved.options != null) _g57.setReserved("options",value62); else _g57.h["options"] = value62;
		value56 = _g57;
		if(__map_reserved["saturn.core.domain.SgcTarget"] != null) _g.setReserved("saturn.core.domain.SgcTarget",value56); else _g.h["saturn.core.domain.SgcTarget"] = value56;
	}
	{
		var value64;
		var _g65 = new haxe.ds.StringMap();
		var value65;
		var _g66 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g66.setReserved("entryCloneId","SEQUENCE_ID"); else _g66.h["entryCloneId"] = "SEQUENCE_ID";
		if(__map_reserved.id != null) _g66.setReserved("id","PKEY"); else _g66.h["id"] = "PKEY";
		if(__map_reserved.dnaSeq != null) _g66.setReserved("dnaSeq","DNA_SEQ"); else _g66.h["dnaSeq"] = "DNA_SEQ";
		value65 = _g66;
		if(__map_reserved.fields != null) _g65.setReserved("fields",value65); else _g65.h["fields"] = value65;
		var value66;
		var _g67 = new haxe.ds.StringMap();
		if(__map_reserved.entryCloneId != null) _g67.setReserved("entryCloneId",false); else _g67.h["entryCloneId"] = false;
		if(__map_reserved.id != null) _g67.setReserved("id",true); else _g67.h["id"] = true;
		value66 = _g67;
		if(__map_reserved.indexes != null) _g65.setReserved("indexes",value66); else _g65.h["indexes"] = value66;
		var value67;
		var _g68 = new haxe.ds.StringMap();
		if(__map_reserved.schema != null) _g68.setReserved("schema",""); else _g68.h["schema"] = "";
		if(__map_reserved.name != null) _g68.setReserved("name","DNA"); else _g68.h["name"] = "DNA";
		value67 = _g68;
		if(__map_reserved.table_info != null) _g65.setReserved("table_info",value67); else _g65.h["table_info"] = value67;
		var value68;
		var _g69 = new haxe.ds.StringMap();
		if(__map_reserved.ID != null) _g69.setReserved("ID","entryCloneId"); else _g69.h["ID"] = "entryCloneId";
		if(__map_reserved["DNA Sequence"] != null) _g69.setReserved("DNA Sequence","dnaSeq"); else _g69.h["DNA Sequence"] = "dnaSeq";
		if(__map_reserved.__HIDDEN__PKEY__ != null) _g69.setReserved("__HIDDEN__PKEY__","id"); else _g69.h["__HIDDEN__PKEY__"] = "id";
		value68 = _g69;
		if(__map_reserved.model != null) _g65.setReserved("model",value68); else _g65.h["model"] = value68;
		var value69;
		var _g70 = new haxe.ds.StringMap();
		if(__map_reserved.polymorph_key != null) _g70.setReserved("polymorph_key","POLYMORPH_TYPE"); else _g70.h["polymorph_key"] = "POLYMORPH_TYPE";
		if(__map_reserved.value != null) _g70.setReserved("value","ENTRY_CLONE"); else _g70.h["value"] = "ENTRY_CLONE";
		value69 = _g70;
		if(__map_reserved.selector != null) _g65.setReserved("selector",value69); else _g65.h["selector"] = value69;
		value64 = _g65;
		if(__map_reserved["saturn.core.domain.SgcEntryClone"] != null) _g.setReserved("saturn.core.domain.SgcEntryClone",value64); else _g.h["saturn.core.domain.SgcEntryClone"] = value64;
	}
	$r = _g;
	return $r;
}(this));
saturn.db.query_lang.SQLVisitor.injection_check = new EReg("^([A-Za-z0-9\\.])+$","");
saturn.app.SaturnServer.main();