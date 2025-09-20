
/**
 * Format a number to a string with appropriate unit suffixes (e.g. k, L)
 * @author Dev Muliya
 * @param value number to format
 * @returns a string with the formatted value
 */
export const formatLargeNumbers = (value: number): string => {
  if (value >= 100000) {
    return (value / 100000).toFixed(1) + 'L'; // Convert to lakhs with one decimal point
  } else if (value >= 10000) {
    return (value / 1000).toFixed(1) + 'k'; // Convert to thousands with one decimal point
  }
  return value.toString(); // Return as-is if less than 10,000
}


export const formateDate=(dateStr:string)=>{
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",  
        year: "numeric",
    });
    return formattedDate;
}

export const checkAuthError = (e:any)=>{
  return e.message == "Login expired" || e.message == "Access denied. No token provided."
}

export const floorNumToString = (n:number)=>{
  let str = "";
  if(n===0) str = "G.F";
  else if(n===-1) str = "B1";
  else if(n===-2) str = "B2";
  else if(n===100) str= "Terrace";
  else if(!n) str = "NA";
  else str = n.toString();
  return "Floor : " + str;
}
