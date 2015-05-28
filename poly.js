/*jslint regexp: true */

function poly(polynomial) {
    'use strict';
    var p, s;

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function pad(symb, amount, str) {
        var ii, len;
        str = str || '';
        str = String(str);

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

    function sortaEqual(a, b) {
        return (parseFloat(a).toPrecision(15) === parseFloat(b).toPrecision(15));
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
        var reEq = /[^0-9a-zA-Z\s\+\-\/\*\^]/g;

        if (eq.search(reEq) > -1) {
            throw new TypeError('letters, numbers, +, -, *, / only');
        }
        // Pad spaces around *, /, + , -, then collapse to single space max
        eq = eq.replace(/([\*\/\^\+\-])/g, ' $1 ');
        eq = eq.replace(/\s+/g, " ");
        eq = eq.replace(/ \- \- /g, ' + ');

        // Expand adjacent coefficient/identifier to explicit multiplication
        eq = eq.replace(/(\d)([a-zA-Z])/g, '$1 * $2');
        eq = eq.replace(/([\*\+\-\/]*)(\S+?) \^ (\S+?)/g, function () {
            var args = arguments, ii, len, a = [], joiner = ' * ', opLoc = 0;
            len = +args[3];
            for (ii = 0; ii < len; ii = ii + 1) {
                a.push(args[2]);
            }
            opLoc = args[5].indexOf(args[0]) - 2;
            if (args[5].slice(opLoc, opLoc + 1) === '/') {
                joiner = ' / ';
            }
            return a.join(joiner);//args[2] + ' * ' + args[4];
        });

        // make all terms + and transport negativity to a coefficient
        // Is this really a good idea?
        //console.log(eq.match(/^(?![a-zA-Z0-9])+\-(?=[a-zA-Z0-9])/g));
        //eq = eq.replace(/^(?![a-zA-Z0-9])+\-(?=[a-zA-Z0-9])/g, ' + -');
        //eq = eq.replace(/[a-zA-Z0-9\.](\-)[a-zA-Z0-9\.]/g, ' + -');
        eq = eq.replace(/( \- )(?=\d)/g, ' + -');

        // Next: allow ^ for positive powers

        // Collapse extra spaces
        //eq = eq.replace(/\s+/g, " ");

        s = eq;
        return eq;
    }

    function followsExp(str) {
        if (!str) {
            return true;
        }
        if (str.length < 12) {
            return false;
        }
        if (str.slice(-6) === '</sup>') {
            return true;
        }
        return false;
    }

    function longestLength(line1, line2) {
        line1 = line1 || '';
        line1 = String(line1);
        line1 = line1.replace(/<[^<>]+>/g, '');
        line2 = line2 || '';
        line2 = String(line2);
        line2 = line2.replace(/<[^<>]+>/g, '');

        return (line1.length > line2.length) ? line1.length : line2.length;
    }

    function formatId(ids) {
        var ii, len, out = '', oExp = {}, exp, newIds = [];

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
            if (oExp[ids[ii]] === 1) {
                newIds.push(ids[ii]);
            }
        }

        // Build term with exponent ids first
        for (exp in oExp) {
            if (oExp.hasOwnProperty(exp)) {
                if (oExp[exp] > 1) {
                    out = out + exp + '<sup>' + oExp[exp] + '</sup>';
                }
            }
        }

        // Append non-exponent ids
        if (newIds.length) {
            len = newIds.length;
            for (ii = 0; ii < len; ii = ii + 1) {
                if (!followsExp(out)) {
                    out = out + ' * ';
                }
                out = out + newIds[ii];
            }
        }

        return out;
    }

    function formatPoly(eq) {
        var ii, len, output = '', termsNum, termsDen, terms, last = 0, co = 1, joiner = '';
        len = eq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            // glue terms together with + and -
            co = eq[ii].coef;
            termsNum = '';
            termsDen = '';
            terms = '';
            if (eq[ii].idNum.length || eq[ii].idDen.length) {
                if (eq[ii].idNum.length) {
                    if (co && co != 1) {
                        termsNum = ' * ';
                    }
                    termsNum = termsNum + eq[ii].idNum.join(' * ');
                }
                if (eq[ii].idDen.length) {
                    termsDen = ' / ' + eq[ii].idDen.join(' / ');
                }
                terms = termsNum + termsDen;
            } else {
                last = co;
            }

            if (ii > 0) {
                if (co >= 0) {
                    joiner = ' + ';
                } else {
                    joiner = ' - ';
                    co = co * -1;
                }
            }
            if (terms) {
                if (sortaEqual(co, 1) && !termsDen) {
                    output = output + joiner + terms;
                } else {
                    output = output + joiner + co + terms;
                }
            }
        }
        if (!output) {
            return last;
        }
        if (last > 0) {
            return output + ' + ' + last;
        }
        if (sortaEqual(last, 0)) {
            return output;
        }
        return output + ' - ' + (last * -1);
    }

    function formatPolyMulti(eq) {
        // Need to put the terms in the proper order
        var ii, len, output = ['', '', ''], terms = [], glueSymb = '', glueLen = 0, last = 0, co = 1;
        len = eq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            co = eq[ii].coef;
            if (eq[ii].idNum.length || eq[ii].idDen.length) {
                terms[0] = formatId(eq[ii].idNum);
                terms[2] = formatId(eq[ii].idDen);

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
                last = co;
            }
        }

        if (!output[0] && !output[1] && !output[2]) {
            output[1] = last;
        } else {
            if (last > 0) {
                output[1] = output[1] + ' + ' + last;
            } else if (!sortaEqual(last, 0)) {
                // make this - and adjust coefficient
                output[1] = output[1] + ' - ' + (last * -1);
            }
        }
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

    function orderTerms(a, b) {
        var ii, len, oA = {}, oB = {}, ordA = 1, ordB = 1;

        if (!a.idNum.length && !b.idDen.length) {
            return 1;
        }
        // count top
        len = a.idNum.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (oA.hasOwnProperty(a.idNum[ii])) {
                oA[a.idNum[ii]] = oA[a.idNum[ii]] + 1;
                if (oA[a.idNum[ii]] > ordA) {
                    ordA = oA[a.idNum[ii]];
                }
            } else {
                oA[a.idNum[ii]] = 1;
            }
        }

        len = b.idNum.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (oB.hasOwnProperty(b.idNum[ii])) {
                oB[b.idNum[ii]] = oB[b.idNum[ii]] + 1;
                if (oB[b.idNum[ii]] > ordB) {
                    ordB = oB[b.idNum[ii]];
                }
            } else {
                oB[b.idNum[ii]] = 1;
            }
        }

        return ordB - ordA;
    }

    function combineTerms(aEq) {
        var ii, len, iSame, aNewEq = [aEq[0]], aZeroRemoved = [];
        len = aEq.length;

        if (aEq.length === 0) {
            return [];
        }

        for (ii = 1; ii < len; ii = ii + 1) {
            // if it has the same words as a previous, add coefficients
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

        // Remove 0 coefficients
        len = aNewEq.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (!sortaEqual(aNewEq[ii].coef, 0)) {
                aZeroRemoved.push(aNewEq[ii]);
            }
        }

        return aZeroRemoved;
    }

    function consolidateTerms(aEq) {
        var ii, len, jj, jLen, aNewEq = [], newUnits;
        len = aEq.length;

        for (ii = 0; ii < len; ii = ii + 1) {
            aNewEq.push({'coef': 1, 'idNum': [], 'idDen': []});

            // Convert from terse to full terms, if needed
            if (!aEq[ii].coNum) {
                aEq[ii].coNum = [aEq[ii].coef];
                aEq[ii].coDen = [1];
            }

            // Combine values
            jLen = aEq[ii].coNum.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                aNewEq[ii].coef = aNewEq[ii].coef * aEq[ii].coNum[jj];
            }

            jLen = aEq[ii].coDen.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                aNewEq[ii].coef = aNewEq[ii].coef / aEq[ii].coDen[jj];
            }

            // cancel ids that occur in top and bot arrays
            newUnits = cancelIds(aEq[ii]);
            aNewEq[ii].idNum = newUnits[0];
            aNewEq[ii].idDen = newUnits[1];

            if (aEq[ii].coNum) {
                delete aEq[ii].coNum;
                delete aEq[ii].coDen;
            }
        }

        return aNewEq;
    }

    function strictToPoly(eq) {
        var aTerms, ii, len, aEq = [], aFactors, jj, jLen, fact;
        // separate into terms
        aTerms = eq.split(' + ');

        len = aTerms.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            aEq.push({'coNum': [], 'coDen': [], 'idNum': [], 'idDen': []});

            // process factors
            aFactors =  aTerms[ii].match(/(\/\s\S+)|(\* \S+)|(\^ \S+)|(^\S+)/g);
            jLen = aFactors.length;
            for (jj = 0; jj < jLen; jj = jj + 1) {
                fact = aFactors[jj];
                if (fact.slice(0, 1) === '/') {
                    fact = fact.slice(2);
                    if (isNumber(fact)) {
                        aEq[ii].coDen.push(fact);
                    } else {
                        aEq[ii].idDen.push(fact);
                    }
                } else {
                    if (fact.slice(0, 1) === '*') {
                        fact = aFactors[jj].slice(2);
                    }
                    if (isNumber(fact)) {
                        aEq[ii].coNum.push(fact);
                    } else {
                        aEq[ii].idNum.push(fact);
                    }
                }
            }
        }

        return aEq;
    }

    this.format = function format(multiline) {
        if (multiline) {
            return formatPolyMulti(p);
        }
        return formatPoly(p);
    };

    function add(poly1, poly2) {
        var newPoly;
        if (!poly1 || !poly2) {
            return;
        }
        if (!Array.isArray(poly1)) {
            poly1 = combineTerms(consolidateTerms(strictToPoly(readableToStrict(poly1))));
        }
        if (!Array.isArray(poly2)) {
            poly2 = combineTerms(consolidateTerms(strictToPoly(readableToStrict(poly2))));
        }
        newPoly = poly1.concat(poly2);
        return combineTerms(p.concat(newPoly)).sort(orderTerms);
    }

    this.add = function append(newPoly) {
        if (!newPoly) {
            return;
        }
        if (!Array.isArray(newPoly)) {
            newPoly = combineTerms(consolidateTerms(strictToPoly(readableToStrict(newPoly))));
        }
        p = combineTerms(p.concat(newPoly)).sort(orderTerms);
    };

    function multiplyTerm(term, poly) {
        var ii, len, aEq = [];
        len = poly.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            aEq.push({"coef": 1, "idNum": [], "idDen": []});
            aEq[ii].coef = poly[ii].coef * term.coef;
            aEq[ii].idNum = poly[ii].idNum.concat(term.idNum);
            aEq[ii].idDen = poly[ii].idDen.concat(term.idDen);
        }
        return aEq;
    }

    this.multiply = function multiply(newPoly) {
        var ii, len, aEq = [];
        if (!newPoly) {
            return;
        }
        if (!Array.isArray(newPoly)) {
            newPoly = combineTerms(consolidateTerms(strictToPoly(readableToStrict(newPoly))));
        }
        len = newPoly.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (aEq.length) {
                aEq = aEq.concat(multiplyTerm(newPoly[ii], p));
            } else {
                aEq = multiplyTerm(newPoly[ii], p);
            }
        }
        p = combineTerms(consolidateTerms(aEq));
    };

    function foundIds(aId, id, val) {
        var ii, len, aIdTmp = [], aCoTmp = [];
        len = aId.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            if (id === aId[ii]) {
                aIdTmp.push(id);
                aCoTmp.push(val);
            }
        }
        return [aIdTmp, aCoTmp];
    }

    this.substitute = function substitute(ids) {
        var ii, len, aEq = [], id, tmpNum = [], tmpDen = [];

        if (!ids) {
            return formatPolyMulti(p);
        }
        ids = JSON.parse(ids);

        // convert to full poly format
        len = p.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            aEq.push({'coNum': [p[ii].coef], 'coDen': [], 'idNum': p[ii].idNum.slice(0), 'idDen': p[ii].idDen.slice(0)});
        }

        for (id in ids) {
            if (ids.hasOwnProperty(id)) {
                for (ii = 0; ii < len; ii = ii + 1) {
                    tmpNum = foundIds(aEq[ii].idNum, id, ids[id]);
                    tmpDen = foundIds(aEq[ii].idDen, id, ids[id]);

                    aEq[ii].idDen = aEq[ii].idDen.concat(tmpNum[0]);
                    aEq[ii].coNum = aEq[ii].coNum.concat(tmpNum[1]);
                    aEq[ii].idNum = aEq[ii].idNum.concat(tmpDen[0]);
                    aEq[ii].coDen = aEq[ii].coDen.concat(tmpDen[1]);
                }
            }
        }
        return formatPolyMulti(combineTerms(consolidateTerms(aEq)).sort(orderTerms));
    };

    this.strict = function strict() {
        return s;
    };

    p = combineTerms(consolidateTerms(strictToPoly(readableToStrict(polynomial)))).sort(orderTerms);
}
