(async () => {
  try {
    const res = await fetch("./api/is-logged");
    const data = await res.json();
    if (!(res.status === 200)) {
      window.location.href = "./";
    }
  } catch (error) {
    window.location.href = "./";
  }
})();