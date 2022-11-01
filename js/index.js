//Speech Recognition API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';

//select Dom Elements
const start = document.querySelector('#start');
const stop = document.querySelector('#stop');
const status = document.querySelector('#status');
const preview = document.querySelector('#preview');
const command = document.querySelector('#command');
const styleTag = document.createElement('style');


//variables
let htmlString ='';
const accuracy = 0.7;


//funcitons
const handleStart = () => {
    status.innerText = 'Talking';
    command.innerText = '';
    status.classList.add('blink');
    recognition.start();
}
const handleStop = () => {
    status.innerText = 'Not Talking';
    command.innerText = '';
    status.classList.remove('blink');
    recognition.stop();
}

const handleUnrecognized = () => {
    status.innerHTML = 'Not Taling';
    command.innerHTML = 'Could not understand your command!';
    status.classList.remove('blink');
    recognition.stop();
}

const processResult = (result) => {
    const processed = result.trim().toLowerCase();
    if (processed.includes('html')) {
        if (processed.includes('content')) {
            const [, content] = processed.split('html content ');
            htmlString += content;
        } else if (processed.includes('open')) {
            const [, tag] = processed.split('html open ');
            htmlString += `<${tag}>`;
        } else if (processed.includes('close')) {
            const [, tag] = processed.split('html close ');
            htmlString += `</>`;
            preview.innerHTML += htmlString;
            htmlString = '';
        }
    } else if (processed.includes('css')) {
        if(processed.includes('open')){
            const [, tag] = processed.split('css open ');
            styleTag.innerHTML +=`${tag} {`;
        }else if(processed.includes('close')){
            styleTag.innerHTML += '}';
        }else if(processed.includes('style')){
            const [, payload] = processed.split('css style ');
            if(payload){
                const [proper, value] = payload
                .replaceAll('colour', 'color')
                .replaceAll(' pixels', 'px')
                .replaceAll('centre', 'center')
                .replaceAll(' ', '-')
                .split('-is-');
                if(proper && value){
                    styleTag.innerHTML += `${proper}:${value};`;
                }
            }
        }
    } else {
        handleUnrecognized();
    }
};


const handleResults = (event) => {
    const { results, resultIndex } = event;
    const { transcript, confidence } = results[resultIndex][0];
    if (confidence > accuracy) {
        command.innerHTML = `Command: ${transcript}`;
        processResult(transcript);
    }
};




//add the css style tag in the head section
document.head.appendChild(styleTag);


// add event listeners
start.addEventListener('click', handleStart);
stop.addEventListener('click', handleStop);
recognition.addEventListener('result', handleResults);