window.View = window.View || {};

window.View.Main = (function () {

    var worklogDateInput,
        getWorklogButton,
        worklogInput,
        addWorklogsButton,
        totalHoursSpan;

    function init() {

        setLoadingStatus(true);        
        
        Controller.LogController.init();

        View.Table.init();

        getWorklogButton = document.getElementById("getWorklogButton");
        worklogInput = document.getElementById("worklog");
        addWorklogsButton = document.getElementById("addWorklogs");
        totalHoursSpan = document.getElementById("totalHours");

        worklogDateInput = document.getElementById("worklogDate");
        //initialize date with today's date
        worklogDateInput.value = formatDate(new Date());

        mediator.on('modal.totalHours.update', totalHours => {
            totalHoursSpan.innerText = parseFloat(totalHours).toFixed(2) + 'h';
        });

        getWorklogButton.addEventListener("click", () => {
            setLoadingStatus(true);
            Controller.LogController.getWorklogsByDay(worklogDateInput.value).then(() => {
                setLoadingStatus(false);
            });

        });

        addWorklogsButton.addEventListener("click", () => {
            setLoadingStatus(true);
            Controller.LogController.bulkInsert(worklogInput.value).then(() => {
                setLoadingStatus(false);
            });

        });
        setLoadingStatus(false);
    }

    function setWorklogDateInputValue(formattedDate) {

    }

    function formatDate(date) {
        var d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function setLoadingStatus(isLoading) {
        if (isLoading) {
            document.getElementById("loading").classList.remove('hidden');
        } else {
            document.getElementById("loading").classList.add('hidden');
        }
    }

    return {
        init: init,
        setLoadingStatus: setLoadingStatus
    };

})();

window.View.Table = (function () {
    var table,
        tbody;

    var worklogTableRowTemplate = `
    <tr class="worklog">
        <td class="tg-yw4l jira-number-column-item">
            <input type="text" value="{{jiraNumber}}"/>
        </td>
        <td class="tg-yw4l time-spent-column-item">
            <input type="text" value="{{timeSpent}}"/>
        </td>
        <td class="tg-yw4l comment-column-item">
            <input type="text" value="{{comment}}"/>
        </td>
        <td class="tg-yw4l select-column-item">
            <input type="checkbox" name="selected">
        </td>
        </tr>
    <tr>`;

    function addRow(worklogItem) {
        var row = worklogTableRowTemplate
            .replace('{{jiraNumber}}', worklogItem.jira)
            .replace('{{timeSpent}}', worklogItem.timeSpent)
            .replace('{{comment}}', worklogItem.comment);
        tbody.innerHTML += row;
    }

    function deleteRow() {
        //TODO: implement
    }

    function clearRows() {
        var new_tbody = document.createElement('tbody');
        tbody.parentNode.replaceChild(new_tbody, tbody);
        tbody = new_tbody;
    }

    function populateWorklogTable(worklogItems) {
        clearRows();

        for (var i = 0; i < worklogItems.length; i++) {
            var worklogItem = worklogItems[i];
            addRow(worklogItem);
        }
    }

    function init() {
        table = document.getElementById('worklog-items');
        tbody = table.getElementsByTagName('tbody')[0];

        mediator.on('model.workloglist.updated', worklogItems => populateWorklogTable(worklogItems));
    }

    return {
        init: init,
        addRow: addRow,
        deleteRow: deleteRow,
        clearRows: clearRows,
        populateWorklogTable: populateWorklogTable
    };
})();