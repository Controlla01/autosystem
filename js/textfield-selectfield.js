
function textField(options) {
    const {
        id = '',
        title = '',
        type = 'text',
        value = '',
        onKeyPressFunction = null,
        onKeyUpFunction = null,
        readonly = false
    } = options;

    const template = type === "textarea"
        ? `
        <textarea class="text_area" id="${id}" placeholder="" rows="">${value}</textarea>
        <div class="placeholder">${title}:</div>
    `
        : `
        <input class="text_field" type="${type}" id="${id}" placeholder="" value="${value}"
            ${onKeyPressFunction ? `onkeypress="${onKeyPressFunction}"` : ''} 
            ${onKeyUpFunction ? `onkeyup="${onKeyUpFunction}"` : ''}
            ${readonly ? 'readonly' : ''}/>
        <div class="placeholder">${title}</div>
        <div class="issueText" id="issue_${id}"></div>
        `;
    $('#' + id + '_container').html(template);
}


function selectField(options) {
    const {
        id = '',
        title = '',
        emptyValue = '',
        fieldValue = '',
        fieldLabel = ''
    } = options;

    const template = `
    <select class="text_field selectSearch" id="${id}"
        onclick="_selectOption('${id}')" style="opacity: 1;">
		${fieldValue ? `<option selected="selected" value="${fieldValue}">${fieldLabel}</option>` : '<option selected="selected" value="">Select here</option>'}
    </select>
    <div class="placeholder">${title}:</div>
    <div class="searchPanel addSearchPanel animated fadeIn" id="searchPanel_${id}"
        style="display: none;">
        <input class="searchTxt" placeholder="Type here to search"
            id="txtSearchValue_${id}" autocomplete="off"
            onkeyup="filter('${id}')">
        <ul id="searchList_${id}">
            ${emptyValue ? `<li onclick="_clickOption('searchList_${id}', '', '${emptyValue}');">${emptyValue}</li>` : ''}
        </ul>
    </div>
    <div class="issueText" id="issue_${id}"></div>
    `;
    $('#' + id + '_container').html(template);
}


function _selectOption(selectBoxId) {
    $('#txtSearchValue_' + selectBoxId).val('');
    filter(selectBoxId);

    if ($('#searchPanel_' + selectBoxId).is(":visible")) {
        $('#searchPanel_' + selectBoxId).css('display', 'none');
    } else {
        $('#searchPanel_' + selectBoxId).css('display', 'flex');
        $('#txtSearchValue_' + selectBoxId).focus();
    }
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.text_field_container').forEach(container => {
        // If the click is not inside the container, hide its search panel.
        if (!container.contains(e.target)) {
            const searchPanel = container.querySelector('.searchPanel');
            if (searchPanel) {
                searchPanel.style.display = 'none';
            }
        }
    });
});

function filter(selectBoxId) {
    var valThis = $('#txtSearchValue_' + selectBoxId).val();
    $('#searchList_' + selectBoxId + ' > li').each(function () {
        var text = $(this).text();
        (text.toLowerCase().indexOf(valThis.toLowerCase()) > -1) ? $(this).show() : $(this).hide();
    });
};
function _clickOption(selectedOption, id, value) {
    selectBoxId = selectedOption.replace("searchList_", "");
    // Clear previous options and set the selected one
    $('#' + selectBoxId).html(`<option selected="selected" value="${id}">${value}</option>`);
    _selectOption(selectBoxId);
};



// function _getSelectloanDuration(fieldId) {
//     const data = [
//         {
//             'loanDuration': 6,
//             'loanDurationName': '6 months',
//         },
//         {
//             'loanDuration': 12,
//             'loanDurationName': '12 months',
//         },
//         {
//             'loanDuration': 24,
//             'loanDurationName': '24 months',
//         },
//         {
//             'loanDuration': 32,
//             'loanDurationName': '32 months',
//         }
//     ]

//     for (let i = 0; i < data.length; i++) {
//         const id = data[i].loanDuration;
//         const value = data[i].loanDurationName;
//         $('#searchList_' + fieldId).append('<li onclick="_clickOption(\'searchList_' + fieldId + '\', \'' + id + '\', \'' + value + '\')">' + value + '</li>');
//     }
// }

// function _getSelectUser(fieldId) {
//     const data = [
//         { userId: '', userName: 'Select here' }, 
//         { userId: 101, userName: 'John Doe' },
//         { userId: 102, userName: 'Jane Smith' },
//         { userId: 103, userName: 'Michael Johnson' },
//         { userId: 104, userName: 'Emily Williams' }
//     ];

//     for (let i = 0; i < data.length; i++) {
//         const id = data[i].userId;
//         const value = data[i].userName;
//         $('#searchList_' + fieldId).append(
//             '<li onclick="_clickOption(\'searchList_' + fieldId + '\', \'' + id + '\', \'' + value + '\')">' + value + '</li>'
//         );
//     }
// }




// function _getSelectDepartment(fieldId) {
//     const data = [
//         {
//             'department': 1,
//             'departmentName': 'Computer science',
//         },
//         {
//             'department': 2,
//             'departmentName': 'Computer Engineering',
//         },
//         {
//             'department': 3,
//             'departmentName': 'Mass Communication',
//         }
//     ]

//     for (let i = 0; i < data.length; i++) {
//         const id = data[i].department;
//         const value = data[i].departmentName;
//         $('#searchList_' + fieldId).append('<li onclick="_clickOption(\'searchList_' + fieldId + '\', \'' + id + '\', \'' + value + '\')">' + value + '</li>');
//     }
// }