function delay(delayInms) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve(2);
      }, delayInms)
   })
}

export const delayMiliSecond = (time) => delay(time);