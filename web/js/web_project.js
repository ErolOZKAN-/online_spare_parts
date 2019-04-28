var cart_keys = [];
var selected_node = null;

function send() {
    var name = $("#contact-name").val();
    var email_add = $("#contact-email").val();
    var message = $("#contact-message").val();
    $('#form-alert').show();
    $('#form-alert').text("Gönderiliyor..");
    jQuery.ajax({
        url: 'mail.php',
        type: "POST",
        data: {message: message, email: email_add, name: name, cart_keys: JSON.stringify(cart_keys)},
        success: function (result) {
            $("#mail_modal").modal('toggle');
            $('#added_to_chart_text').text(result);
            $('#added_to_chart').modal('show');
        }
    });
}

function send_email() {
    console.log("sending_email");
    $("#sepetim").modal('toggle');
    $("#mail_modal").modal('toggle');
}

function clean_card() {
    cart_keys = [];
    $("#email_button").attr('disabled', 'true');
    $('#added_to_chart_text').text("Sepetiniz temizlenmiştir.");
    $('#added_to_chart').modal('show');
    $("#sepetim").modal('toggle');
}

function open_cart() {
    $("#cart_items").empty();
    var html = '<div class="text-right" style="padding-bottom: 5px"><button class="btn btn-primary btn-sm" onclick="clean_card()">Temizle</button></div>';
    html += "<table id=\"data-table\" class=\"table table-striped table-bordered nowrap\" width=\"100%\">";
    html += "<thead>";
    html += "<tr>";
    html += '<th>Araç</th>';
    html += "<th>Parça Numarası</th>";
    html += "<th>Açıklama</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    cart_keys.forEach(function (item) {
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

    if (cart_keys.length > 0) {
        $("#cart_items").append(html);
        $("#email_button").removeAttr('disabled');
    } else {
        $("#cart_items").append("Sepetiniz boş");
    }
    $("#sepetim").modal('show');

}

function add_to_card() {
    var selected_elements = $('#data-table').find('input[type="checkbox"]:checked');
    if (selected_elements.length == 0) {
        $('#added_to_chart_text').text("Lütfen parça seçiniz.");
        $('#added_to_chart').modal('show');
        return;
    }
    selected_elements.each(function (key, value) {
        var part_id = value.closest('tr').children[1].innerHTML;
        var part_desc = value.closest('tr').children[2].innerHTML;
        cart_keys.push({
            selected_node: selected_node,
            part_id: part_id,
            part_desc: part_desc
        });

    });
    $('#added_to_chart_text').text(selected_elements.length + " parça sepetinize eklenmiştir. Lütfen sepetinizi kontrol ediniz.");
    $('#added_to_chart').modal('show');
}

function set_content(content) {
    $("#table_div").empty();
    var html = " <table id=\"data-table\" class=\"table table-striped table-bordered nowrap\" width=\"100%\">";
    html += "<thead>";
    html += "<tr>";
    html += '<th><input name="select_all" value="1" type="checkbox" disabled></th>';
    html += "<th>Parça Numarası</th>";
    html += "<th>Açıklama</th>";
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
