export const MORSE_MAP = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
  K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
  U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  0:'-----', 1:'.----', 2:'..---', 3:'...--', 4:'....-', 5:'.....',
  6:'-....', 7:'--...', 8:'---..',9:'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', '!':'-.-.--', '/':'-..-.', '-':'-....-'
};

export const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v])=>[v,k]));

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

export function toBin(n) { return n.toString(2).padStart(8, '0'); }
export function toHex(n) { return '0x' + n.toString(16).toUpperCase().padStart(2,'0'); }
