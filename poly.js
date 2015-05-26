function poly(polynomial) {
    'use strict';
    /*jslint regexp: true */

    var p;

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function pad(symb, amount, str) {
        var ii, len;
        str = str || '';
        str = new String(str);

        if (len < 1) {
            return '';
        }

        // strip HTML
        len = amount - str.replace(/<[^<>]+>/g, '').length;

        for (ii = 0; ii < len; ii = ii + 1) {
            // center str in padding
            if (ii % 2) {
                str = str + symb;
            } else {
                str = symb + str;
            }
        }
        return str;
    }

    function arraysEqual(a, b) {
        var ii, len;

        if (a === b) {
            return true;
        }
        if (a === null || b === null) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }

        a.sort();
        b.sort();

        len = a.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (a[ii] !== b[ii]) {
                return false;
            }
        }
        return true;
    }

    function sameIds(words, aEq) {
        var ii, len;
        len = aEq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (arraysEqual(aEq[ii].idNum, words.idNum) && arraysEqual(aEq[ii].idDen, words.idDen)) {
                return ii;
            }
        }
        return -1;
    }

    function readableToStrict(eq) {
        var reEq = /[^0-9a-zA-Z\s\+\-\/\*]/g;

        if (eq.search(reEq) > -1) {
            throw new TypeError('letters, numbers, +, -, *, / only');
        }
        // Pad spaces around * and / if needed
        eq = eq.replace(/([\*\/\^])/g, ' $1 ');

        // Expand adjacent coefficient/identifier to explicit multiplication
        eq = eq.replace(/(\d)([a-zA-Z])/g, '$1 * $2');

        // make all terms + and transport negativity to a coefficient
        // Is this necessary?
        //console.log(eq.match(/^(?![a-zA-Z0-9])+\-(?=[a-zA-Z0-9])/g));
        //eq = eq.replace(/^(?![a-zA-Z0-9])+\-(?=[a-zA-Z0-9])/g, ' + -');
        //eq = eq.replace(/[a-zA-Z0-9\.](\-)[a-zA-Z0-9\.]/g, ' + -');
        eq = eq.replace(/( \- )(?=\d)/g, ' + -');
        eq = eq.replace(/( \- \-)/g, ' + ');

        // Next: allow ^ for positive powers

        // Collapse extra spaces
        eq = eq.replace(/\s+/g, " ");

        return eq;
    }

    function longestLength(line1, line2) {
        line1 = line1 || '';
        line2 = line2 || '';
        line1 = new String(line1);
        line2 = new String(line2);
        line1 = line1.replace(/<[^<>]+>/g, '');
        line2 = line2.replace(/<[^<>]+>/g, '');

        return (line1.length > line2.length) ? line1.length : line2.length;
    }

    function formatId(ids, delimiter) {
        var ii, len, out = '', oExp = {}, exp, first = true, newIds = [], degree = 0;
        delimiter = delimiter || ' * ';

        // if there are multiple ids, user ^ notation
        len = ids.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            // consolidate multiple ids with ^
            if (oExp[ids[ii]]) {
                oExp[ids[ii]] = oExp[ids[ii]] + 1;
            } else {
                oExp[ids[ii]] = 1;
            }
        }

        // remove any ids with a count > 1
        for (ii = 0; ii < len; ii = ii + 1) {
            if (oExp[ids[ii]] > degree) {
                degree = oExp[ids[ii]];
            }
            if (oExp[ids[ii]] === 1) {
                newIds.push(ids[ii]);
            }
        }

        for (exp in oExp) {
            if (oExp.hasOwnProperty(exp)) {
                if (oExp[exp] > 1) {
                    if (!first) {
                        out = out + ' * ';
                    } else {
                        first = false;
                    }
                    out = out + exp + '<sup>' + oExp[exp] + '</sup>';
                }
            }
        }

        if (ids.length) {
            if (!first && newIds.length) {
                out = out + delimiter;
            }
            out = out + newIds.join(delimiter);
        }

        return [out, degree];
    }

    function formatIds(top, bot) {
        var num = formatId(top, ' * ')[0],
            den = formatId(bot, ' / ')[0],
            out = '';

        out = num;
        if (bot.length) {
            out = num + ' / ' + den;
        }

        return out;
    }

    function formatPoly(eq) {
        var ii, len, output = '', terms, last = '', co = 1;
        len = eq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            // glue terms together with + and -
            co = eq[ii].coef;
            if (eq[ii].idNum.length || eq[ii].idDen.length) {
                if (ii > 0) {
                    if (co > 0) {
                        output = output + ' + ';
                    } else {
                        // make this - and adjust coefficient
                        output = output + ' - ';
                        co = co * -1;
                    }
                }
                terms = formatIds(eq[ii].idNum, eq[ii].idDen);

                // Format and append ids
                if (co === 1 && eq[ii].idNum.length) {
                    output = output + terms;
                }
                if (co !== 1 && (eq[ii].idNum.length || eq[ii].idDen.length)) {
                    output = output + co + terms;
                }
            } else {
                if (ii > 0) {
                    if (eq[ii].coef > 0) {
                        last = last + ' + ' + co;
                    } else {
                        // make this - and adjust coefficient
                        last = last + ' - ' + (co * -1);
                    }
                }
            }
        }
        return output + last;
    }

    function formatPolyMulti(eq) {
        // Need to put the terms in the proper order
        var ii, len, output = ['', '', ''], terms = [], glueSymb = '', glueLen = 0, co = '', last = '', lastCo = '', lastSign = ' + ', degree = 0;
        len = eq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            //terms = formatIdsMulti(eq[ii].idNum, eq[ii].idDen);
            co = eq[ii].coef;
            if (eq[ii].idNum.length || eq[ii].idDen.length) {
                degree = 1;
                terms[0] = formatId(eq[ii].idNum)[0];
                terms[2] = formatId(eq[ii].idDen)[1];

                // glue terms together with + and -
                if (ii > 0) {
                    if (co >= 0) {
                        glueSymb = ' + ';
                    } else {
                        // make this - and adjust coefficient
                        co = co * -1;
                        glueSymb = ' - ';
                    }
                    glueLen = 3;
                }

                if (co === 1 && eq[ii].idNum.length) {
                    co = '';
                } else {
                    co = co.toString(10);
                }

                // format  numbers and ids
                if (!eq[ii].idDen.length) {
                    // if top only
                    output[0] = output[0] + pad(' ', glueLen + co.length + longestLength(terms[0], ''));
                    output[1] = output[1] + glueSymb + co + terms[0];
                    output[2] = output[2] + pad(' ', glueLen + co.length + longestLength(terms[0], ''));
                } else {
                    // all else
                    terms[1] = pad('—', longestLength(co + terms[0], terms[2]) + 2);
                    output[0] = output[0] + pad(' ', glueLen) + pad(' ', terms[1].length, co + terms[0]);
                    output[1] = output[1] + glueSymb + terms[1];
                    output[2] = output[2] + pad(' ', glueLen) + pad(' ', terms[1].length, terms[2]);
                }
            } else {
                //if (ii > 0) {
                    if (co > 0) {
                        last = last + ' + ' + co;
                    } else {
                        // make this - and adjust coefficient
                        last = last + ' - ' + (co * -1);
                    }
                //}
            }
        }
        output[1] = output[1] + last;
        return output.join("\n");
    }

    function cancelIds(term) {
        var ii, len, newTop = [], iBot;
        if (term.idNum.length === 0 || term.idDen.length === 0) {
            return [term.idNum, term.idDen];
        }
        len = term.idNum.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            iBot = term.idDen.indexOf(term.idNum[ii]);
            if (iBot === -1) {
                newTop.push(term.idNum[ii]);
            } else {
                term.idDen.splice(iBot, 1);
            }
        }
        return [newTop, term.idDen];
    }

    function combineTerms(aEq) {
        var ii, len, iSame, aNewEq = [aEq[0]];//, newUnits;
        len = aEq.length;

        if (aEq.length === 0) {
            return [];
        }

        for (ii = 1; ii < len; ii = ii + 1) {
            // if it has the same words as previous - ALL previous
            iSame = sameIds(aEq[ii], aNewEq);
            if (iSame > -1 && ii !== 0) {
                aNewEq[iSame].coef = aNewEq[iSame].coef + aEq[ii].coef;
            } else {
                aNewEq.push({
                    'coef': aEq[ii].coef,
                    'idNum': aEq[ii].idNum.sort(),
                    'idDen': aEq[ii].idDen.sort()
                });
            }
        }

        return aNewEq;
    }

    function consolidateTerms(aEq) {
        var ii, len, jj, jLen, aNewEq = [], newUnits;
        len = aEq.length;

        for (ii = 0; ii < len; ii = ii + 1) {
            aNewEq.push({'coef': 1, 'idNum': [], 'idDen': []});

            // Combine values
            jLen = aEq[ii].digitNum.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                aNewEq[ii].coef = aNewEq[ii].coef * aEq[ii].digitNum[jj];
            }

            jLen = aEq[ii].digitDen.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                aNewEq[ii].coef = aNewEq[ii].coef / aEq[ii].digitDen[jj];
            }

            // cancel ids that occur in top and bot arrays
            newUnits = cancelIds(aEq[ii]);
            aNewEq[ii].idNum = newUnits[0];
            aNewEq[ii].idDen = newUnits[1];
        }

        return aNewEq;
    }

    function strictToPoly(eq) {
        var aTerms, ii, len, aEq = [], aFactors, jj, jLen, fact;
        // separate into terms
        aTerms = eq.split(' + ');

        len = aTerms.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            aEq.push({'digitNum': [], 'digitDen': [], 'idNum': [], 'idDen': []});

            // process factors
            aFactors =  aTerms[ii].match(/(\/\s\S+)|(\* \S+)|(^\S+)/g);
            jLen = aFactors.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                fact = aFactors[jj];
                if (fact.slice(0, 1) === '/') {
                    fact = fact.slice(2);
                    if (isNumber(fact)) {
                        aEq[ii].digitDen.push(fact);
                    } else {
                        aEq[ii].idDen.push(fact);
                    }
                } else {
                    if (fact.slice(0, 1) === '*') {
                        fact = aFactors[jj].slice(2);
                    }
                    if (isNumber(fact)) {
                        aEq[ii].digitNum.push(fact);
                    } else {
                        aEq[ii].idNum.push(fact);
                    }
                }
            }
        }

        return aEq;
    }

    this.strict = readableToStrict(polynomial);
    p = combineTerms(consolidateTerms(strictToPoly(this.strict)));

    this.format = function format(multiline) {
        if (multiline) {
            return formatPolyMulti(p);
        }
        return formatPoly(p);
    };

    this.add = function add(newPoly) {
        if (!newPoly) {
            return;
        }
        if (!Array.isArray(newPoly)) {
            newPoly = combineTerms(consolidateTerms(strictToPoly(readableToStrict(newPoly))));
        }

        p = combineTerms(p.concat(newPoly));
    }
    
    function formatMulti(eq) {
        return formatPolyMulti(eq);
    }

    this.substitute = function substitute(ids) {
        var ii, len, jj, jLen, aEq = [], id;
        
        // convert to full poly format
        len = p.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            // aEq.push({'coef': p[ii].coef, 'idNum': p[ii].idNum, 'idDen': p[ii].idDen});
            aEq.push({'digitNum': [p[ii].coef], 'digitDen': [], 'idNum': p[ii].idNum, 'idDen': p[ii].idDen});
        }
        for (id in ids) {
            if (ids.hasOwnProperty(id)) {
                for (ii = 0; ii < len; ii = ii + 1) {
                    jLen = aEq[ii].idNum.length;
                    for (jj = 0; jj < jLen; jj = jj + 1) {
                        if (id === aEq[ii].idNum[jj]) {
                            aEq[ii].idNum.splice(jj, 1);
                            aEq[ii].digitNum.push(ids[id]);
                        }
                    }
                    jLen = aEq[ii].idDen.length;
                    for (jj = 0; jj < jLen; jj = jj + 1) {
                        if (id === aEq[ii].idDen[jj]) {
                            aEq[ii].idDen.splice(jj, 1);
                            aEq[ii].digitDen.push(ids[id]);
                        }
                    }
                }
            }
        }
        //console.log(aEq);
        //console.log(consolidateTerms(aEq));
        //console.log(combineTerms(consolidateTerms(aEq)));
        return formatMulti(combineTerms(consolidateTerms(aEq)));
    }
}
