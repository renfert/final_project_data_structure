// import {Leaf} from './Leaf.js'
// import {Node} from './Node.js'

class Btree {
    constructor(order) {
        this.root = new Leaf()
        this.maxkey = order - 1
        this.leaf = null
        this.item = -1
        this.name = ''
        this.recnum = -1
        this.length = 0
        this.eof = true
        this.found = false

    }

    insert(key, rec) {
        var stack = [];
        this.leaf = this.root;
        // is node
        while (!this.leaf.isLeaf()) {
            stack.push(this.leaf);
            this.item = this.leaf.getItem(key);
            this.leaf = this.leaf.children[this.item];
        }
        this.item = this.leaf.addKey(key, rec);
        this.name = key;
        this.eof = false;
        if (this.item === -1) {
            this.found = true;
            this.item = this.leaf.getItem(key, false);
            this.recnum = this.leaf.recnum[this.item];
        } else {
            this.found = false;
            this.recnum = rec;
            this.length++;
            if (this.leaf.name.length > this.maxkey) {
                var pL = this.leaf;
                var pR = this.leaf.split();
                var ky = pR.name[0];
                this.item = this.leaf.getItem(key, false);
                if (this.item === -1) {
                    this.leaf = this.leaf.nextLeaf;
                    this.item = this.leaf.getItem(key, false);
                }
                while (true) {
                    if (stack.length === 0) {
                        var newN = new Node();
                        newN.name[0] = ky;
                        newN.children[0] = pL;
                        newN.children[1] = pR;
                        this.root = newN;
                        break;
                    }
                    var nod = stack.pop();
                    nod.addKey(ky, pL, pR);
                    if (nod.name.length <= this.maxkey) break;
                    pL = nod;
                    pR = nod.split();
                    ky = nod.name.pop();
                }
            }
        }
        return (!this.found);
    };

    

    seek(key, near) {
        if (typeof near != 'boolean') near = false;
        this.leaf = this.root;
        while (!this.leaf.isLeaf()) {
            this.item = this.leaf.getItem(key);
            this.leaf = this.leaf.children[this.item];
        }
        this.item = this.leaf.getItem(key, near);
        if (near && this.item == -1 && this.leaf.nextLeaf !== null) {
            this.leaf = this.leaf.nextLeaf;
            this.item = 0;
        }
        if (this.item === -1) {
            this.eof = true;
            this.name = '';
            this.found = false;
            this.recnum = -1;
        } else {
            this.eof = false;
            this.found = (this.leaf.name[this.item] === key);
            this.name = this.leaf.name[this.item];
            this.recnum = this.leaf.recnum[this.item];
        }
        return (!this.eof);
    };

    
}