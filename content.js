/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command && (msg.command == "download_csv")) {

        sendResponse("all tables downloaded'");

        function formatCurrentDateTime () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            }
            var hour = today.getHours();
            if(hour<10){
                hour='0'+hour;
            } 
            var minute = today.getMinutes();
            if(minute<10){
                minute='0'+minute;
            }
            var milliseconds = today.getMilliseconds();
            if(milliseconds<10){
                milliseconds='0'+milliseconds;
            } else if (milliseconds<100) {
                milliseconds='00'+milliseconds;
            }
            var today = dd+''+mm+''+yyyy+''+hour+''+minute+''+milliseconds;
            return today;
        }
        
        //http://stackoverflow.com/a/1496863
        function replaceNbsps(str) {
            var re = new RegExp(String.fromCharCode(160), "g");
            return str.replace(re, " ").trim();
        }

        //http://jsfiddle.net/terryyounghk/KPEGU/
        function _rows2csv($rows) {
            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            var tmpColDelim = String.fromCharCode(11); // vertical tab character
            var tmpRowDelim = String.fromCharCode(0); // null character
            // actual delimiter characters for CSV format
            var colDelim = '";"';
            var rowDelim = '"\r\n"';
            return '"' + $rows.map(function(i, row) {
                    var $row = $(row);
                    var $cols = $row.find('td,th');
                    return $cols.map(function(j, col) {
                        var $col = $(col);
                        var text = $col.text();
                        var a = text.replace('"', '""');
                        // escape double quotes
                        return replaceNbsps(a);
                    }).get().join(tmpColDelim);
                }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"\r\n';
        }

        function exportTableToCSV($table, filename) {
            var $bodyrows = $table.find('tr:has(td)');
            var $headrows = $table.find('tr:has(th)');

            // Grab text from table into CSV formatted string
            var csv = '';
            if ($headrows.length) {
                csv = _rows2csv($headrows);
            }
            csv += _rows2csv($bodyrows);
            // Data URI
            var csvData = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
            var link = document.createElement('a');
            link.href = csvData;
            link.download = filename;
            link.target = '_blank';
            link.click();
        }

        var tbls = $("table");
        tbls.each(function(i) {
            exportTableToCSV.apply(this, [$(tbls[i]), 'exportTable' + formatCurrentDateTime() + '.csv']);
        });

    }
});