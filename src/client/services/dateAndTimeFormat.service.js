const formateDateTime = (isoStr, output = "both") => {
  const newDate = new Date(isoStr);

  // const date = `${}, ${}`
  const formatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoStr));

  const result = {
    time: () => formatted.split(',')[1],
    date: () => formatted.split(',')[0],
    both: () => formatted,
  };

  return result[output]();
};

export default formateDateTime;
