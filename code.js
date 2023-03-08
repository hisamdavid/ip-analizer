const faders = document.querySelectorAll(".fade-in");
const div=document.querySelector(".continter");
const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -250px 0px"
};

const appearOnScroll = new IntersectionObserver(function(
  entries,
  appearOnScroll
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      setTimeout(function(){
        entry.target.classList.add("delete");
        div.classList.remove('delete')
      }, 5000);
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

const getway=document.querySelector(".getway");
const subnet=document.querySelector(".subnet");
const classString=document.querySelector(".class");
const hostSize=document.querySelector(".hostSize");
const network=document.querySelector(".network");
const brodcast=document.querySelector(".brodcast");
function dec2bin(dec){
  let bin =(dec >>> 0).toString(2);
  while(bin.length < 8){
    bin="0"+bin
  }
  return bin;
}
function inRange(x, min, max) {
  return x > min && x < max;
}
function checkIp(ip){
  let ipArr=ip.split(".");
  if(ipArr.length !== 4) return false;
  ipArr.forEach((e)=>{
    let num=parseInt(e)
    if(num>255 || num<0)return false;
  })
  return true
}
function strToArray(ip){
  let ipArr=ip.split(".");
  return ipArr.map(Number);
}
function count(str, find) {
  return (str.split(find)).length - 1;
}
function ipClass(ipArr){
  let ip=ipArr[0];
  let className="";
  let classNumber;
  if(inRange(ip,0,127)){
    className+="A class";
    classNumber=1;
  }else if(inRange(ip,127,192)){
    className+="B class";
    classNumber=2;
  }else if(inRange(ip,191,224)){
    className+="C class";
    classNumber=3;
  }else if(inRange(ip,223,240)){
    className+="D class multi-cast";
    classNumber=4;
  }else if(inRange(ip,127,192)){
    className+="E class expermntel";
    classNumber=5;
  }else if(ip==127){
    className="loop back address"
    classNumber=0;
  }
  
  if(ip==10){
    className="private "+className;
  }else if(ip==172 && inRange(ipArr[1],15,32)){
    className="private "+className;
  }else if(ip==192 && ipArr[1]==168){
    className="private "+className;
  }else{
    className="public "+className;
  }
  classString.innerText=className;
  return classNumber
}
function subneting(maskArr,ipArr){
  
  let hosts=0;
  let index=0;
  let flag=true;
  let incrment
  let binery
  let numOfZeros
  maskArr.forEach((e)=>{
    if(e===255){
      index+=1;
    }
    binery=dec2bin(e);
    numOfZeros=count(binery,"0");
    hosts += numOfZeros;
    if(numOfZeros > 0 && flag){
      incrment=numOfZeros
      incrment=2**incrment;
      flag=false
    }
  });
  hosts=2**hosts;
  hostSize.innerHTML=(hosts-3)+" hosts";
  let start=[...ipArr];
  start[index]=0;
  let range=false;
  let networkIp;
  let brodcastIp;
  let getwayIp;
  while (!range){
    if(inRange(ipArr[index],start[index]-1,start[index]+incrment)){
      networkIp=[...start];
      brodcastIp=[...start];
      brodcastIp[index]+=(incrment-1);
      if(index!==3){
        let i=index;
        while (i!==3) {
          i++;
          brodcastIp[i]=255;
          networkIp[i]=0;
        }
      }
      getwayIp=[...networkIp];
      getwayIp[3]+=1;
      range=true
    }
    start[index]+=incrment;
  }
  network.innerHTML=networkIp.join(".").toString();
  brodcast.innerHTML=brodcastIp.join(".").toString();
  getway.innerHTML=getwayIp.join(".").toString();
}
function mask(classNumber){
  let subnetM=new Array();
  switch (classNumber) {
    case 1:
      subnetM="255.0.0.0";
      break;
      case 2:
        subnetM="255.255.0.0";
        break;
      case 3:
        subnetM="255.255.255.0";
        break;
    default:
      subnetM="no subnet";
      break;
  }
  subnet.innerHTML='<input type="text" class="mask" value="'+subnetM+'">';
  return strToArray(subnetM);
}

let textbox=document.querySelector(".ip");
textbox.addEventListener("input", () => {
  if(checkIp(textbox.value)){
    let ipArray=strToArray(textbox.value);
    let classNum=ipClass(ipArray);
    let subnetMask=mask(classNum);
    subneting(subnetMask,ipArray);
    let mm=document.querySelector(".mask")
    mm.addEventListener("input", () => {
      let mmsk=strToArray(mm.value);
      subneting(mmsk,ipArray);
    });
  }
});