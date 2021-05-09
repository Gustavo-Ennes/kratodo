const animateCSS = (element, animation, duration='1', delay='0', many=false, prefix='animate__') => {    
  try{    
    new Promise((resolve) => {
      const animationName = `${prefix}${animation}`;
      let  nodes = !many ? [document.querySelectorAll(element)[0]] : document.querySelectorAll(element)

      nodes.forEach(node => {        

        node.classList.add(`${prefix}animated`, animationName);

        if(duration != '1'){
          node.style.setProperty('--animate-duration', `${duration}s`)
        }
        if(delay != '0'){
          node.style.setProperty('--animate-delay', `${delay}s`)
        }

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
          event.stopPropagation();
          node.classList.remove(`${prefix}animated`, animationName);
          node.style.removeProperty('--animate-delay')
          node.style.removeProperty('--animate-duration')
          resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});

      })
    });
  }catch(err){
    console.log(err)
  }
}

module.exports = animateCSS