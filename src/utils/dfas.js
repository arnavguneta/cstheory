/* 
 * Created by Arnav Guneta
 * Usage: In a separate file, put the operation [union/intersect] at the top followed by the grafstate format for 2 DFAs.
 *        Change the file variable to your filename at line 12. By default its 'doc.graf'
 *        Run the script using node dfas.js (or any other way to compile js)
 *        The resulting DFA will be added to the input file at the bottom in grafstate format
 * Notes: Not thoroughly tested, let me know if any changes need to be made at arguneta@uga.edu
 */

//const fs = require('fs');

//let file = 'doc.graf';

let setQ = (dfa_1, dfa_2, dfa) => {
    for (let i = 0; i < dfa_1.Q.length; i++) {
        for (let j = 0; j < dfa_2.Q.length; j++) {
            dfa.Q.push(dfa_1.Q[i] + dfa_2.Q[j]);
        }
    }
}

let setDelta = (dfa_1, dfa_2, dfa) => {
    let obj;
    for (let i = 0; i < dfa_1.Q.length; i++) {
        for (let j = 0; j < dfa_2.Q.length; j++) {
            let state = dfa_1.Q[i] + dfa_2.Q[j];

            obj = {
                current: state,
                transitions: {}
            }

            dfa.S.forEach(trans => {
                obj.transitions[trans] = dfa_1.d[i].transitions[trans] + '' + dfa_2.d[j].transitions[trans];
            })

            dfa.d.push(obj);
        }
    }
}

let setFinalState = (dfa_1, dfa_2, dfa, op) => {
    if (op === 'intersection') {
        dfa_1.F.forEach(f1 => {
            dfa_2.F.forEach(f2 => {
                dfa.F.push(f1 + '' + f2);
            });
        });
    } else {
        dfa.Q.forEach(state => {
            dfa_1.F.forEach(accept_state => {
                if (state.includes(accept_state) && !dfa.F.toString().includes(state))
                    dfa.F.push(state);
            });
            dfa_2.F.forEach(accept_state => {
                if (state.includes(accept_state) && !dfa.F.toString().includes(state))
                    dfa.F.push(state);
            });
        });
    }
}

let computeUnionOrIntersection = (dfa_1, dfa_2, op) => {
    let dfa = {
        Q: [],
        S: [],
        d: [],
        q0: '',
        F: []
    };
    dfa.S = [...new Set([...dfa_1.S, ...dfa_2.S])];
    setQ(dfa_1, dfa_2, dfa);
    setDelta(dfa_1, dfa_2, dfa);
    setFinalState(dfa_1, dfa_2, dfa, op);
    dfa.q0 = dfa_1.q0 + dfa_2.q0;
    return dfa;
}

let convertToGraf = dfa => {
    let data = `\nresulting dfa:\n\\+ dfa\n{\nQ={${dfa.Q.toString()}};\nS={${dfa.S.toString()}};\nd:Q\\*S->Q;\n`;
    dfa.d.forEach(delta => {
        dfa.S.forEach(trans => {
            data += `d(${delta.current},${trans})=${delta.transitions[trans]};\n`;
        });
    });
    data += `q0=${dfa.q0};\n`;
    data += `F={${dfa.F.toString()}};\n}\n`;
    fs.appendFileSync('doc.graf', data);
}

let convertToGrafText = dfa => {
    let data = `\\+ dfa\n{\nQ={${dfa.Q.toString()}};\nS={${dfa.S.toString()}};\nd:Q\\*S->Q;\n`;
    dfa.d.forEach(delta => {
        dfa.S.forEach(trans => {
            data += `d(${delta.current},${trans})=${delta.transitions[trans]};\n`;
        });
    });
    data += `q0=${dfa.q0};\n`;
    data += `F={${dfa.F.toString()}};\n}\n`;
    return data;
}

let convertDFAFromText = data => {
    let dfa = {
        Q: [],
        S: [],
        d: [],
        q0: '',
        F: []
    };
    let obj = { current: '', transitions: {} };
    data = data.split('\n');
    let temp;
    data.forEach(line => {
        if (line.includes('Q=') || line.includes('S=') || line.includes('F=')) {
            temp = line.split('{');
            temp = temp[1].split('}');
            temp = temp[0].split(',');
            if (line.includes('Q='))
                dfa.Q = temp;
            else if (line.includes('S='))
                dfa.S = temp;
            else if (line.includes('F='))
                dfa.F = temp;
        } else if (line.includes('q0=')) {
            temp = line.split('=');
            temp = temp[1].split(';');
            dfa.q0 = temp[0];
        } else if (line.includes('d(')) {
            temp = line.split('(');
            temp = temp[1].split(',');
            obj.current = temp[0];

            temp = temp[1].split(')=');
            temp[1] = temp[1].split(';');
            obj.transitions[temp[0]] = temp[1][0];

            if (dfa.S[dfa.S.length - 1] === temp[0]) {
                dfa.d.push(obj);
                obj = { current: '', transitions: {} };
            }
        }
    })
    return dfa;
}

let convertFromGrafFile = file => {
    let dfas = [];
    let dataBuffer = fs.readFileSync(file);
    let data = dataBuffer.toString().split('\\+ dfa');
    let op = data.splice(0, 1)[0].split('\n')[0];
    data.forEach(obj => {
        dfas.push(convertDFAFromText(obj));
    })
    dfas.push(op);
    return dfas;
}

let convertFromGrafText = text => {
    let dfas = [];
    let data = text.toString().split('\\+ dfa');
    data.splice(0, 1);
    data.forEach(obj => {
        dfas.push(convertDFAFromText(obj));
    })
    return dfas;
}

let apiCall = (op, dfa_1, dfa_2) => {
    let dfas = convertFromGrafText(`${dfa_1}\n${dfa_2}`);
    let dfa = computeUnionOrIntersection(dfas[0], dfas[1], op);
    return convertToGrafText(dfa);
}

module.exports = apiCall