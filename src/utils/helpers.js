const isWithin30Minutes = (classDate, classTime) => {
    const now = new Date();
    const classDateTime = new Date(`${classDate.toDateString()} ${classTime}`);
    const timeDiff = classDateTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);
    return minutesDiff > 30;
  };
  
  module.exports = {
    isWithin30Minutes,
  };
  