"use strict"
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
let buttonElem = document.querySelector('button.search-button');

// readTextFile("file:///E:/work/2020/10/mozambic/total_domains.txt");
let inputElem = document.querySelector('input.keyword-input');
buttonElem.onclick = function(event) {
    
    let validateData = /^[a-zA-Z]{5,32}$/.test(inputElem.value);
    let mainElem = document.querySelector('.main-body');
    let errorElem = mainElem.querySelector('div.error>p')
    if (validateData == true) {
        errorElem.innerHTML = '&nbsp;';
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let start = new Date();
        let spinnerElem = document.querySelector('.display-spinner');
        spinnerElem.classList.toggle('display');
        fetch(`https://api.opensquat.com/prod/?keyword=${inputElem.value}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            
            let hiddenElem = document.querySelectorAll('.loading-hidden');
            hiddenElem.forEach(element => {
                if (element.classList.contains('display') === false) element.classList.add('display');
                
            });
            spinnerElem.classList.toggle('display');
            let {response, keyword, count, domains} = result ;

            mainElem.querySelector('.display-count span').innerHTML = count;
            let runTime = (new Date() - start) / 1000
            mainElem.querySelector('.display-runtime span').innerHTML = runTime.toFixed(2);

            let tbody =  mainElem.querySelector('.display-table tbody');
            tbody.innerHTML = '';
            for (const iterator of domains) {
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${iterator}</td>
                    <td><div><span class="control-copy">Copy</span> <span class="control-whois">WHOIS</span></div></td>
                `;
                tbody.append(tr);
            }
        })
        .catch(error => console.log('error', error));
        
    } else {
        let errorOutputString = (inputElem.value.includes('.') === true) ? 'invalid keyword: use words and not domains' : 'keyword too short or long';
        errorElem.innerHTML = errorOutputString;
    }
    // readTextFile("./total_domains.txt");

};

let selectedTd;
let tableElem = document.querySelector('.display-table table');

tableElem.onclick = function(event) {
  let target = event.target; 
  if (target.className === 'control-copy') {
      copyControl(target);
  } else if (target.className === 'control-whois') {
    whoisControl(target);
  } else {
      return;
  }
};

let copyControl = (elem) => {
    // console.log(elem.parentElement.previousElementSibling);
    // console.log(elem.parentElement.parentElement.previousElementSibling.textContent);
    copyToClipBoard(elem.parentElement.parentElement.previousElementSibling.textContent);
}

let whoisControl = (elem) => {
    let domainCheck = elem.parentElement.parentElement.previousElementSibling.textContent;
    let encodedString = Base64.encode(domainCheck);
    // console.log(encodedString);
    window.open(`https://pulsedive.com/indicator/?ioc=${encodedString}`);
}

const copyToClipBoard = (str) =>
{
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                document.querySelector('span.change-domain').textContent = allText;
            }
        }
    }
    rawFile.send(null);
}

// Execute a function when the user releases a key on the keyboard
inputElem.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard

  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    buttonElem.onclick();
  }
});
