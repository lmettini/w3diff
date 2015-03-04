var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] ');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    page.viewportSize = { width: 1280, height: 800 };

    function onPageReady() {
        window.setTimeout(function () {
            page.render(output);
            phantom.exit();
        }, 2000);
         
    }

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {           
            function checkReadyState() {
                setTimeout(function () {
                    var readyState = page.evaluate(function () {
                        return document.readyState;
                    });

                    if ("complete" === readyState) {
                        onPageReady();
                    } else {
                        checkReadyState();
                    }
                });
            }

            checkReadyState();
        }        
    });
}
