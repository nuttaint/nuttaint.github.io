$(document).ready(function () {

  // // Initialize select2
  $("#selUser").select2({

  });

  // Read selected option
  $('#but_read').click(function () {
    var username = $('#selUser option:selected').text();
    var userid = $('#selUser').val();

    location.replace(username + ".html");

  });
});

$(document).ready(function () {

  // // Initialize select2
  $("#selLine").select2({

  });

  // Read selected option
  $('#but_line').click(function () {
    var username = $('#selLine option:selected').text();
    var userid = $('#selLine').val();

    location.replace(username + ".html");

  });
});

