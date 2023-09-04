"use strict";

let to; //time out name;

const time_out = (ms) => {
  to = new Promise((resolve) => setTimeout(resolve, ms));
  return to;
};

// const clear_time_out = async() => {
//   await clearTimeout(to);
// }

const jwtDecode = async (t) => {
  console.log("jwtDecode, in");
  let token = {};

  const b64DecodeUnicode = async (str) =>
    decodeURIComponent(
      Array.prototype.map
        .call(
          window.atob(str),
          (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

  token = await JSON.parse(
    await b64DecodeUnicode(t.split(".")[1].replace("-", "+").replace("_", "/"))
  );

  console.log("jwtDecode, out", token);
  return token;
};

const get_env_vars = () => {
  if (import.meta.env == undefined) {
    console.log('utilities, get_env_vars', 111, process.env.VITE_ENV);
    return process.env;
  } else {
    console.log('utilities, get_env_vars', 112, import.meta.env.VITE_ENV);
    return import.meta.env;
  }
};

const reset_obj = (obj) => {
  Object.keys(obj).map((key) => {
    if (obj[key] instanceof Array) obj[key] = [];
    else obj[key] = undefined;
  });
};

const add_seconds = (date, seconds) => {
  let date2 = new Date( date.getTime() );
  date2.setSeconds(date.getSeconds() + seconds);
  return date2;
}

const add_seconds_int = (hours, minutes, seconds, increment) => {
  let time = hours * 60 * 60 + minutes * 60 + seconds + increment
  let h = Math.floor(time / 60 / 60)
  if (h > 23) { h = h % 24 }
  time -= h
  const m = Math.floor(time / 60)
  time -= m
  const s = time;

  if (h < 10) 
  return {
    h: h,
    m: m,
    s: s
}
}

const image_to_Base64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export { time_out, jwtDecode, get_env_vars, reset_obj, add_seconds, image_to_Base64 };
