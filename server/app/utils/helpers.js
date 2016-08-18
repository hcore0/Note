//工具
var moment = require('moment');

module.exports = {
    //显示行号
    rowNum: function (index) {
      return index + 1;
    },
    //日期格式转换
    dateConverter: function (date, pattern) {
      return moment(date).format(pattern);
    },
    //bootstrap分页
    pagination: function (total, current, url) {
        var str = '<nav class="text-center"><ul class="pagination">';
        var i;
        if (current > 1) {
            str += `<li>
              <a href="${url + '?page=' + (current - 1) }" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`;
        } else {
            str += `<li class="disabled">
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`;
        }

        for (i = 1; i <= total; i++) {
            if (i === current) {
               str += `<li class="active"><a href="#">${i}</a></li>`;
            } else {
               str += `<li><a href="${url + '?page=' + i}">${i}</a></li>`;
            }
        }

        if (current < total) {
            str += `<li>
              <a href="${url + '?page=' + (current + 1) }" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>`;
        } else {
            str += `<li class="disabled">
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>`;
        }

        return str;
    },
    section: function (name, options) {
        if (!this._sections) {
            this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
    }
};