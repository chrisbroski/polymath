function poly(polynomial) {
    'use strict';
    var oPoly;

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function pad(symb, amount, str) {
        var ii, len;
        str = str || '';
        str = String(str);

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
        if (a === b) {
            return true;
        }
        if (a === null || b === null) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        return (!a.some(function (val, ii) {
            return b[ii] !== val;
        }));
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
        var reEq = /[^0-9\.a-zA-Z\s\+\-\/\*\^]/g;
        eq = String(eq);

        if (eq.search(reEq) > -1) {
            throw new TypeError('Letters, numbers, +, -, *, /, ^ only.');
        }
        if (eq.search(/\^\-/) > -1) {
            throw new TypeError('Negative exponents not allowed.');
        }
        // Pad spaces around *, /, + , -, then collapse to single space max
        eq = eq.replace(/([\*\/\^\+\-])/g, ' $1 ');
        eq = eq.replace(/\s+/g, " ");
        eq = eq.replace(/ \- \- /g, ' + ');
        // trim
        eq = eq.replace(/^\s+|\s+$/g, '');

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

            return a.join(joiner);
        });

        // make all terms + and transport negativity to a coefficient
        eq = eq.replace(/( \- )(?=\d)/g, ' + -');
        // this messed up things like 'x + -1' I should fix this better but here is some duct-tape
        eq = eq.replace(/ \+ \+ \-/g, ' + -');
        eq = eq.replace(/^\- /g, '-');

        console.log('strict: ' + eq);
        return eq;
    }

    this.clean = function clean(inp) {
        return readableToStrict(inp);
    };

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

    function formatId(ids, facSep, expSep) {
        var out = '', oExp = {}, newIds = [];
        facSep = facSep || ' * ';

        // if there are multiple ids, user ^ notation
        ids.forEach(function (id) {
            // consolidate multiple ids with ^
            if (oExp[id]) {
                oExp[id] = oExp[id] + 1;
            } else {
                oExp[id] = 1;
            }
        });

        // remove any ids with a count > 1
        ids.forEach(function (id) {
            if (oExp[id] === 1) {
                newIds.push(id);
            }
        });

        // Build term with exponent ids first
        Object.keys(oExp).forEach(function (exp) {
            if (oExp.hasOwnProperty(exp)) {
                if (oExp[exp] > 1) {
                    if (expSep) {
                        out = out + exp + expSep + oExp[exp];
                    } else {
                        out = out + exp + '<sup>' + oExp[exp] + '</sup>';
                    }
                }
            }
        });

        // Append non-exponent ids
        newIds.forEach(function (id) {
            if (!followsExp(out)) {
                out = out + facSep;
            }
            out = out + id;
        });

        return out;
    }

    function formatParseable(eq) {
        var output = '', terms = [], glueSymb = '', last = 0, co = 1;

        eq.forEach(function (term) {
            co = term.coef;
            if (term.idNum.length || term.idDen.length) {
                terms[0] = formatId(term.idNum, ' * ', '^');
                terms[1] = formatId(term.idDen, ' / ', '^');

                // glue terms together with + and -
                if (output) {
                    if (co >= 0) {
                        glueSymb = ' + ';
                    } else {
                        // make this - and adjust coefficient
                        co = co * -1;
                        glueSymb = ' - ';
                    }
                }

                if (co === 1 && term.idNum.length) {
                    co = '';
                } else {
                    co = co.toString(10);
                }

                // format  numbers and ids
                output = output + glueSymb + co + terms[0];
                if (term.idDen.length > 0) {
                    output = output + ' / ' + terms[1];
                } else if (term.idDen.length > 1) {
                    output = output + ' /(' + terms[1] + ')';
                }
            } else {
                last = co;
            }
        });

        if (!output) {
            output = last;
        } else {
            if (last > 0) {
                output = output + ' + ' + last;
            } else if (!sortaEqual(last, 0)) {
                // make this - and adjust coefficient
                output = output + ' - ' + (last * -1);
            }
        }
        return output;
    }

    function formatPolyMulti(eq) {
        // Need to put the terms in the proper order
        var output = ['', '', ''], terms = [], glueSymb = '', glueLen = 0, last = 0, co = 1;

        eq.forEach(function (term) {
            co = term.coef;
            if (term.idNum.length || term.idDen.length) {
                terms[0] = formatId(term.idNum);
                terms[2] = formatId(term.idDen);

                // glue terms together with + and -
                if (output[1]) {
                    if (co >= 0) {
                        glueSymb = ' + ';
                    } else {
                        // make this - and adjust coefficient
                        co = co * -1;
                        glueSymb = ' - ';
                    }
                    glueLen = 3;
                }

                if (co === 1 && term.idNum.length) {
                    co = '';
                } else {
                    co = co.toString(10);
                }

                // format  numbers and ids
                if (!term.idDen.length) {
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
        });

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
        var newTop = [], iBot;
        if (term.idNum.length === 0 || term.idDen.length === 0) {
            return [term.idNum, term.idDen];
        }

        term.idNum.forEach(function (num) {
            iBot = term.idDen.indexOf(num);
            if (iBot === -1) {
                newTop.push(num);
            } else {
                term.idDen.splice(iBot, 1);
            }
        });
        return [newTop, term.idDen];
    }

    function orderTerms(a, b) {
        var oA = {}, oB = {}, ordA = 1, ordB = 1;

        if (!a.idNum.length && !b.idDen.length) {
            return 1;
        }
        // count top
        a.idNum.forEach(function (term) {
            if (oA.hasOwnProperty(term)) {
                oA[term] = oA[term] + 1;
                if (oA[term] > ordA) {
                    ordA = oA[term];
                }
            } else {
                oA[term] = 1;
            }
        });

        b.idNum.forEach(function (term) {
            if (oB.hasOwnProperty(term)) {
                oB[term] = oB[term] + 1;
                if (oB[term] > ordB) {
                    ordB = oB[term];
                }
            } else {
                oB[term] = 1;
            }
        });

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
                    coef: aEq[ii].coef,
                    idNum: aEq[ii].idNum.sort(),
                    idDen: aEq[ii].idDen.sort()
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
        var ii, len, aNewEq = [], newUnits;
        len = aEq.length;

        for (ii = 0; ii < len; ii = ii + 1) {
            aNewEq.push({coef: 1, idNum: [], idDen: []});

            // Convert from terse to full terms, if needed
            if (!aEq[ii].coNum) {
                aEq[ii].coNum = [aEq[ii].coef];
                aEq[ii].coDen = [1];
            }

            // Combine values
            aEq[ii].coNum.forEach(function (coNum) {
                aNewEq[ii].coef = aNewEq[ii].coef * coNum;
            });

            aEq[ii].coDen.forEach(function (coDen) {
                aNewEq[ii].coef = aNewEq[ii].coef / coDen;
            });

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
            aEq.push({coNum: [1], coDen: [1], idNum: [], idDen: []});

            // process factors
            aFactors = aTerms[ii].match(/(\/\s\S+)|(\* \S+)|(\^ \S+)|(^\S+)/g);
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
            return formatPolyMulti(oPoly);
        }
        return formatParseable(oPoly);
    };

    function parseP(newPoly) {
        if (!newPoly) {
            return [];
        }
        if (!Array.isArray(newPoly)) {
            if (newPoly.constructor.name === 'poly') {
                newPoly = combineTerms(consolidateTerms(strictToPoly(readableToStrict(newPoly.polyString)))).sort(orderTerms);
            } else {
                newPoly = combineTerms(consolidateTerms(strictToPoly(readableToStrict(newPoly)))).sort(orderTerms);
            }
        }
        return newPoly;
    }

    function add(poly1, poly2) {
        var newPoly;
        poly1 = parseP(poly1);
        poly2 = parseP(poly2);
        newPoly = poly1.concat(poly2);
        return combineTerms(newPoly).sort(orderTerms);
    }

    this.add = function append(newPoly) {
        oPoly = add(parseP(newPoly), oPoly);
        this.polyString = formatParseable(oPoly);
        return formatParseable(oPoly);
    };

    function multiplyTerm(term, poly) {
        var aNewPoly = [];

        poly.forEach(function (pTerm) {
            var newTerm = {coef: 1, idNum: [], idDen: []};
            newTerm.coef = pTerm.coef * term.coef;
            newTerm.idNum = pTerm.idNum.concat(term.idNum);
            newTerm.idDen = pTerm.idDen.concat(term.idDen);
            aNewPoly.push(newTerm);
        });
        return aNewPoly;
    }

    this.multiply = function multiply(newPoly) {
        var aEq = [];
        newPoly = parseP(newPoly);

        newPoly.forEach(function (term) {
            aEq = aEq.concat(multiplyTerm(term, oPoly));
        });
        oPoly = combineTerms(consolidateTerms(aEq));
        this.polyString = formatParseable(oPoly);
        return formatParseable(oPoly);
    };

    this.subtract = function negateAndAdd(newPoly) {
        newPoly = parseP(newPoly);
        newPoly.multiply('-1');
        oPoly = add(parseP(newPoly), oPoly);
        this.polyString = formatParseable(oPoly);
        return formatParseable(oPoly);
    };

    function foundIds(aId, id, val) {
        var aIdTmp = [], aCoTmp = [];

        aId.forEach(function (i) {
            if (id === i) {
                aIdTmp.push(id);
                aCoTmp.push(val);
            }
        });
        return [aIdTmp, aCoTmp];
    }

    this.solve = function solve(ids) {
        var ii, len, aEq = [], tmpNum = [], tmpDen = [];

        if (!ids) {
            return formatPolyMulti(oPoly);
        }
        ids = JSON.parse(ids);

        // convert to full poly format
        len = oPoly.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            aEq.push({
                coNum: [oPoly[ii].coef],
                coDen: [],
                idNum: oPoly[ii].idNum.slice(0),
                idDen: oPoly[ii].idDen.slice(0)
            });
        }

        //for (id in ids) {
        Object.keys(ids).forEach(function (id) {
            if (ids.hasOwnProperty(id)) {
                // should be able to replace polynomial value types
                /*if (id typeof 'string') {
                    id = id.parse;
                }*/
                for (ii = 0; ii < len; ii = ii + 1) {
                    tmpNum = foundIds(aEq[ii].idNum, id, ids[id]);
                    tmpDen = foundIds(aEq[ii].idDen, id, ids[id]);

                    aEq[ii].idDen = aEq[ii].idDen.concat(tmpNum[0]);
                    aEq[ii].coNum = aEq[ii].coNum.concat(tmpNum[1]);
                    aEq[ii].idNum = aEq[ii].idNum.concat(tmpDen[0]);
                    aEq[ii].coDen = aEq[ii].coDen.concat(tmpDen[1]);
                }
            }
        });
        oPoly = combineTerms(consolidateTerms(aEq)).sort(orderTerms);
        this.polyString = formatParseable(oPoly);
        return formatParseable(oPoly);
    };

    oPoly = parseP(polynomial);
    // Just to make the object more readable in the console.
    this.polyString = formatParseable(oPoly);
}
