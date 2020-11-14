// import {Leaf} from './Leaf.js'
// import {Node} from './Node.js'

class Btree {
    constructor(order) {
        this.root = new Leaf()
        this.maxkey = order - 1
        this.minkey1 = Math.floor(order / 2)
        this.minkeyn = Math.floor(this.maxkey / 2)
        this.leaf = null
        this.item = -1

        this.keyval = ''
        this.recnum = -1
        this.length = 0
        this.eof = true
        this.found = false

    }

    insert(key, rec) {
        var stack = [];
        this.leaf = this.root;
        while (!this.leaf.isLeaf()) {
            stack.push(this.leaf);
            this.item = this.leaf.getItem(key);
            this.leaf = this.leaf.nodptr[this.item];
        }
        this.item = this.leaf.addKey(key, rec);
        this.keyval = key;
        this.eof = false;
        if (this.item === -1) {
            this.found = true;
            this.item = this.leaf.getItem(key, false);
            this.recnum = this.leaf.recnum[this.item];
        } else {
            this.found = false;
            this.recnum = rec;
            this.length++;
            if (this.leaf.keyval.length > this.maxkey) {
                var pL = this.leaf;
                var pR = this.leaf.split();
                var ky = pR.keyval[0];
                this.item = this.leaf.getItem(key, false);
                if (this.item === -1) {
                    this.leaf = this.leaf.nextLeaf;
                    this.item = this.leaf.getItem(key, false);
                }
                while (true) {
                    if (stack.length === 0) {
                        var newN = new Node();
                        newN.keyval[0] = ky;
                        newN.nodptr[0] = pL;
                        newN.nodptr[1] = pR;
                        this.root = newN;
                        break;
                    }
                    var nod = stack.pop();
                    nod.addKey(ky, pL, pR);
                    if (nod.keyval.length <= this.maxkey) break;
                    pL = nod;
                    pR = nod.split();
                    ky = nod.keyval.pop();
                }
            }
        }
        return (!this.found);
    };

    remove(key) {
        if (typeof key == 'undefined') {
            if (this.item === -1) {
                this.eof = true;
                this.found = false;
                return false;
            }
            key = this.leaf.keyval[this.item];
        }
        this._del(key);
        if (!this.found) {
            this.item = -1;
            this.eof = true;
            this.keyval = '';
            this.recnum = -1;
        } else {
            this.seek(key, true);
            this.found = true;
        }
        return (this.found);
    };

    seek(key, near) {
        if (typeof near != 'boolean') near = false;
        this.leaf = this.root;
        while (!this.leaf.isLeaf()) {
            this.item = this.leaf.getItem(key);
            this.leaf = this.leaf.nodptr[this.item];
        }
        this.item = this.leaf.getItem(key, near);
        if (near && this.item == -1 && this.leaf.nextLeaf !== null) {
            this.leaf = this.leaf.nextLeaf;
            this.item = 0;
        }
        if (this.item === -1) {
            this.eof = true;
            this.keyval = '';
            this.found = false;
            this.recnum = -1;
        } else {
            this.eof = false;
            this.found = (this.leaf.keyval[this.item] === key);
            this.keyval = this.leaf.keyval[this.item];
            this.recnum = this.leaf.recnum[this.item];
        }
        return (!this.eof);
    };

    skip(cnt) {
        if (typeof cnt != 'number') cnt = 1;
        if (this.item == -1 || this.leaf === null) this.eof = true;
        if (cnt > 0) {
            while (!this.eof && this.leaf.keyval.length - this.item - 1 < cnt) {
                cnt = cnt - this.leaf.keyval.length + this.item;
                this.leaf = this.leaf.nextLeaf;
                if (this.leaf === null) this.eof = true;
                else this.item = 0;
            }
            if (!this.eof) this.item = this.item + cnt;
        } else {
            cnt = -cnt;
            while (!this.eof && this.item < cnt) {
                cnt = cnt - this.item - 1;
                this.leaf = this.leaf.prevLeaf;
                if (this.leaf === null) this.eof = true;
                else this.item = this.leaf.keyval.length - 1;
            }
            if (!this.eof) this.item = this.item - cnt;
        }
        if (this.eof) {
            this.item = -1;
            this.found = false;
            this.keyval = '';
            this.recnum = -1;
        } else {
            this.found = true;
            this.keyval = this.leaf.keyval[this.item];
            this.recnum = this.leaf.recnum[this.item];
        }
        return (this.found);
    };

    goto(cnt) {
        if (cnt < 0) {
            this.goBottom();
            if (!this.eof) this.skip(cnt + 1);
        } else {
            this.goTop();
            if (!this.eof) this.skip(cnt - 1);
        }
        return (this.found);
    };

    keynum() {
        if (this.leaf === null || this.item === -1) return -1;
        var cnt = this.item + 1;
        var ptr = this.leaf;
        while (ptr.prevLeaf !== null) {
            ptr = ptr.prevLeaf;
            cnt += ptr.keyval.length;
        }
        return cnt;
    };

    goTop() {
        this.leaf = this.root;
        while (!this.leaf.isLeaf()) {
            this.leaf = this.leaf.nodptr[0];
        }
        if (this.leaf.keyval.length === 0) {
            this.item = -1;
            this.eof = true;
            this.found = false;
            this.keyval = '';
            this.recnum = -1;
        } else {
            this.item = 0;
            this.eof = false;
            this.found = true;
            this.keyval = this.leaf.keyval[0];
            this.recnum = this.leaf.recnum[0];
        }
        return (this.found);
    };

    goBottom() {
        this.leaf = this.root;
        while (!this.leaf.isLeaf()) {
            this.leaf = this.leaf.nodptr[this.leaf.nodptr.length - 1];
        }
        if (this.leaf.keyval.length === 0) {
            this.item = -1;
            this.eof = true;
            this.found = false;
            this.keyval = '';
            this.recnum = -1;
        } else {
            this.item = this.leaf.keyval.length - 1;
            this.eof = false;
            this.found = true;
            this.keyval = this.leaf.keyval[this.item];
            this.recnum = this.leaf.recnum[this.item];
        }
        return (this.found);
    };

    pack() {
        this.goTop(0);
        if (this.leaf == this.root) return;

        // Pack leaves
        var toN = new leaf();
        var toI = 0;
        var frN = this.leaf;
        var frI = 0;
        var parKey = [];
        var parNod = [];
        while (true) {
            toN.keyval[toI] = frN.keyval[frI];
            toN.recnum[toI] = frN.recnum[frI];
            if (toI === 0) parNod.push(toN);
            if (frI == frN.keyval.length - 1) {
                if (frN.nextLeaf === null) break;
                frN = frN.nextLeaf;
                frI = 0;
            } else {
                frI++;
            }
            if (toI == this.maxkey - 1) {
                var tmp = new leaf();
                toN.nextLeaf = tmp;
                tmp.prevLeaf = toN;
                toN = tmp;
                toI = 0;
            } else {
                toI++;
            }
        }
        var mov = this.minkyl - toN.keyval.length;
        frN = toN.prevLeaf;
        if (mov > 0 && frN !== null) {
            for (var i = toN.keyval.length - 1; i >= 0; i--) {
                toN.keyval[i + mov] = toN.keyval[i];
                toN.recnum[i + mov] = toN.recnum[i];
            }
            for (var i = mov - 1; i >= 0; i--) {
                toN.keyval[i] = frN.keyval.pop();
                toN.recnum[i] = frN.recnum.pop();
            }
        }
        for (i = 1, len = parNod.length; i < len; i++) {
            parKey.push(parNod[i].keyval[0]);
        }
        parKey[parKey.length] = null;

        // Rebuild nodes
        var kidKey, kidNod;
        while (parKey[0] !== null) {
            kidKey = parKey;
            kidNod = parNod;
            parKey = [];
            parNod = [];
            var toI = this.maxkey + 1;
            for (var i = 0, len = kidKey.length; i < len; i++) {
                if (toI > this.maxkey) {
                    toN = new Node();
                    toI = 0;
                    parNod.push(toN);
                }
                toN.keyval[toI] = kidKey[i];
                toN.nodptr[toI] = kidNod[i];
                toI++;
            }
            mov = this.minkyn - toN.keyval.length + 1;
            if (mov > 0 && parNod.length > 1) {
                for (var i = toN.keyval.length - 1; i >= 0; i--) {
                    toN.keyval[i + mov] = toN.keyval[i];
                    toN.nodptr[i + mov] = toN.nodptr[i];
                }
                frN = parNod[parNod.length - 2];
                for (var i = mov - 1; i >= 0; i--) {
                    toN.keyval[i] = frN.keyval.pop();
                    toN.nodptr[i] = frN.nodptr.pop();
                }
            }
            for (var i = 0, len = parNod.length; i < len; i++) {
                parKey.push(parNod[i].keyval.pop());
            }
        }
        this.root = parNod[0];
        this.goTop();
        return (this.found);
    };
}