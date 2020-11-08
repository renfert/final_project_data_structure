class Btree {
    constructor(order) {
        this.root = new leaf()
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
}