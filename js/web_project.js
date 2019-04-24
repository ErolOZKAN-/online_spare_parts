var cart_keys = [];
var selected_node = null;

function open_cart() {

    $("#cart_items").empty();
    var html = " <table id=\"data-table\" class=\"table table-striped table-bordered nowrap\" width=\"100%\">";
    html += "<thead>";
    html += "<tr>";
    html += '<th>Araç</th>';
    html += "<th>Part No:</th>";
    html += "<th>Açıklama:</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    cart_keys.forEach(function (item) {
        console.log(item);
        html += "<tr>";
        html += "<th>";
        html += item.selected_node.text;
        html += "</th>";
        html += "<th>";
        html += item.part_id;
        html += "</th>";
        html += "<th>";
        html += item.part_desc;
        html += "</th>";
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    $("#cart_items").append(html);
    if (cart_keys.length > 0) {
        $("#email_button").removeAttr('disabled');
    }
    $("#sepetim").modal('show');

}

function add_to_card() {
    var keys = [];
    var cart_table = $("#data-table tr");
    var selected_elements = $('#data-table').find('input[type="checkbox"]:checked');

    if (selected_elements.length == 0) {
        $('#added_to_chart_text').text("Lütfen parça seçiniz.");
        $('#added_to_chart').modal('show');
        return;
    }
    console.log(selected_elements);
    selected_elements.each(function (key, value) {
        keys.push(value.parents());
    });
    console.log(keys);
//     keys.forEach(function (key) {
//         cart_keys.push({
//             selected_node: selected_node,
//             part_id: cart_table[key].children[1].innerHTML,
//             part_desc: cart_table[key].children[2].innerHTML
//         });
//     });
//     $('#added_to_chart_text').text(selected_elements.length + " parça sepetinize eklenmiştir. Lütfen sepetinizi kontrol ediniz.");
//     $('#added_to_chart').modal('show');
}

function set_content(content) {
    $("#table_div").empty();
    var html = " <table id=\"data-table\" class=\"table table-striped table-bordered nowrap\" width=\"100%\">";
    html += "<thead>";
    html += "<tr>";
    html += '<th><input name="select_all" value="1" type="checkbox" disabled></th>';
    html += "<th>Part No:</th>";
    html += "<th>Açıklama:</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    var content = content.split("\n");
    content.forEach(function (line) {
        var line = line.split("---");
        html += "<tr>";
        html += '<td><input name="select_all" value="1" type="checkbox"></td>';
        line.forEach(function (tab) {
            html += "<td>";
            html += tab;
            html += "</td>";
        });
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    html += '<div class="text-right" style="padding-right: 20px"><button type="button" class="btn btn-primary btn-md" onclick="add_to_card()"><i class="fa fa-shopping-cart"></i> Sepete Ekle</button></div>';
    $("#table_div").append(html);
}

function get_content(id) {
    var data = "";
    jQuery.ajax({
        url: 'content.php',
        type: "POST",
        data: {id: id},
        success: function (result) {
            data = result;
        },
        async: false
    });
    return data;
}


function readTextFile() {
    var data = "";
    jQuery.ajax({
        url: 'data.php',
        success: function (result) {
            data = JSON.parse(result);
        },
        async: false
    });
    return data;
}

$(function () {
    var options = {
        bootstrap2: false,
        showTags: true,
        levels: 5,
        data: readTextFile(),
        multiSelect: $('#chk-select-multi').is(':checked'),
        onNodeSelected: function (event, node) {
            $("#pdf_div").empty();
            console.log(node);
            var html = '<object data="pdfs/' + node.id + '.pdf" type="application/pdf" width="100%" height="300px"></object>';
            $("#pdf_div").append(html);

            selected_node = node;
            var content = get_content(node.id);
            set_content(content);
        },
        // onNodeUnselected: function (event, node) {
        //     $('#selectable-output').prepend('<p>' + node.text + ' was unselected</p>');
        // }
    };
    $('#treeview').treeview(options);
});
