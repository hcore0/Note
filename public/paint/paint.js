function PaintGame (dom) {
    var pWidth = parseInt(getComputedStyle(dom.parentElement).width);
    dom.width = pWidth;
    this.ctx = dom.getContext('2d');
    this.isPainting = false;
    this.pointsTemp = [];
    this.boundingClientRect = dom.getBoundingClientRect();

    dom.onmousedown = function (event) {
        this.isPainting = true;
        var p = this._getPoint(event.clientX, event.clientY);
        this.ctx.moveTo(p.x, p.y);
        this._drawPoint(p.x, p.y);
        p.type = 'm';
        this.pointsTemp.push(p);
    }.bind(this);
    dom.onmouseup = function (event) {
        this.isPainting = false;
    }.bind(this);
    dom.onmouseleave = function (event) {
        this.isPainting = false;
    }.bind(this);
    dom.onmousemove = function (event) {
        if (this.isPainting) {
            var p = this._getPoint(event.clientX, event.clientY);
            this._drawPoint(p.x, p.y);
            this.pointsTemp.push(p);
        }
    }.bind(this);

    this.resetPencil();
}

PaintGame.prototype.resetPencil = function () {
    var ctx = this.ctx;
    ctx.strokeStyle = '#f00';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
};

PaintGame.prototype._drawPoint = function (x, y) {
    var ctx = this.ctx;
    ctx.lineTo(x, y);
    ctx.stroke();
};

PaintGame.prototype._getPoint = function (x, y) {
    return {
        x: x - this.boundingClientRect.left,
        y: y - this.boundingClientRect.top
    };
};

PaintGame.prototype.moveTo = function (p) {
    this.ctx.moveTo(p.x, p.y);
};


var pg = new PaintGame(document.querySelector('#cav'));

var socket = io('/paint');

socket.on('draw', function(data) {
      data.data.data.forEach(function (p) {
        if (p.type === 'm') {
          pg.moveTo(p);
        }
        pg._drawPoint(p.x, p.y);
     });
});

function com () {
  if (pg.pointsTemp.length > 0) {
    socket.emit('addDraw', {
        data: pg.pointsTemp
    });
    pg.pointsTemp = [];
  }
}

setInterval(com, 1000);


$('#paint-tools').delegate('[data-cmd]', 'click', function(event) {
    var tar = $(this).data('cmd');


});
