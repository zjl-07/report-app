const dowp = (resolve, reject) => {
  setTimeout(() => {
    reject("things went wrong");
  }, 2000);
  //   reject("things went wrong");
};

dowp(result => {
  console.log("success", result);
});
