let t = 0;
setInterval(() => {
  console.clear();
  let s = "";
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 40; x++) {
      const v = Math.sin((x + t) * 0.2) + Math.cos((y - t) * 0.2);
      s += v > 1 ? "#" : v > 0 ? "*" : v > -1 ? "." : " ";
    }
    s += "\n";
  }
  console.log(s);
  t += 0.3;
}, 50);
