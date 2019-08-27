
    // Optional function to sort all load data
    function sortMenu(arr){
        var sorted = arr.sort(function(a, b){
            return a.productCode < b.productCode ? -1 : a.productCode > b.productCode ? 1 : 0;
        })
        return sorted;
    }
    // Categorizes the data based on Eload, Call/Text, and Data
    function categorizeMenu(arr, cat){
        var categorized = [];
        for(var x=0; x<arr.length; x++){
            arr[x]['category'] == cat ? categorized.push(arr[x]) : true;
        }
        if(categorized.length == 0){
            $('.warning-text').show();
            return categorized;
        }
        $('.warning-text').hide();
        return categorized;
    }
    function categorizeTelco(arr, cat){
        var telco = [];
        for(var x=0; x<arr.length; x++){
            arr[x]['network'] == cat ? telco.push(arr[x]) : true;
        }
        $('.back-to-menu').show();
        return telco;
    }
    // Closes the modal and clears all texts and caches of parent div as well as its child div
    function closeModal(){
        $('.close').click(function(){
            $('.item-details1, .item-details2, .item-details3').empty();
            $('.dark-background').fadeOut();
        })
    }
    // Redirects to transaction dialogue
    function goToBuy(img, pcode, price){        
        $('.dark-background, .pri-cont').hide();
        $('.sec-cont').fadeIn();

        var p_image = "<font>" + img + "&emsp;";
        var p_code = "<font class='product-code'>" + pcode + "</font></font>";
        var p_price = "<font class='product-price'>" + price + "<font>"
        
        $('.promo-details-cont').append(p_image + p_code);
        $('.price-cont').append(p_price);
    }
    // Buys the chosen item
    function buyItem(routerMac, userMac){
        $('.buy-cancel').click(function(){
            location.reload();
        })
        $('.buy-proceed').click(function(){
            var pcode = $('.product-code').text();
            var price = parseFloat($('.product-price').text().match(/[\d\.]+/g).join(''));
            var mobileNum = $('.mobile-num').val();
            
            if(mobileNum == ''){
                alert('Please Comple Fields ');
            }
            else if(mobileNum[0] != '0' && mobileNum[1] != '9' && mobileNum.length == 11){
                alert('Invalid mobile number');
            }
            else if(mobileNum.match(/[\d\.]+/g).join('').length != 11){
                alert('Invalid mobile number');
            }
            else{
                $('.preloader').fadeIn();
                $.ajax({
                    url : 'http://139.162.108.239/getLoad?routerMac=' + routerMac +  
                          '&userMac=' + userMac + '&mobileNum=' + mobileNum + '&denomination=' +
                           pcode + '&price=' + price,    // Note: When using in real time, change 'ZTEST1' into pcode variable
                    method: 'GET',
                    success: function(result){
                        alert(result);
                        $('.preloader').fadeOut();
                        location.reload();
                    },
                    error: function(){
                        alert('An error occured please repeat the transaction');
                        $('.preloader').fadeOut();
                    }
                })                   
            }       
        })  
    }
    // Loads all the data
    function loadMenu(arr){
        //arr = sortMenu(arr);
        $('.menu-items-2').hide();
        $('.menu-items').attr('style', 'max-height: 450px;') 
        $.each(arr, function(key, val){
            // initialize the images class name
            var img;
            (val['network'] == 'Globe' ? img = 'globe' :
             val['network'] == 'Smart' ? img = 'smart' :
             val['network'] == 'Sun' ? img = 'sun' :
             val['network'] == 'TM' ? img = 'tm' :
             val['network'] == 'TNT' ? img = 'tnt': 0);
            
            var tr = "<tr>";
            var td1 = "<td class='item-img item-img-" + img + "'>" + val['image'] + "</td>"
            var td2 = "<td class='item-description id_" + key + "'>" +
                      "<font class='productCode'>" + val['productCode'] + "</font>" +
                      "<font class='productDescription'>" + val['description'] + "</font>" + 
                      "</td>";
            var td3 = "<td class='item-btn'>" +
                      "<button class='btn btn-submit btn-buy btn_" + key + "'type='button'>" +
                      "<font>" + val['price'] + "</font>" +
                      "</button>" +
                      "</td>"
            $('.menu-table').append(tr+td1+td2+td3);

            $('.btn_'+key).click(function(){
                goToBuy(val['image'], val['productCode'], val['price']);    
            })
            
            // Modal section when a user clicks an item description
            $('.id_'+key).click(function(){
                $('.dark-background').fadeIn();
                var p_image = "<font>" + val['image'] + "&emsp;";
                var p_code = "<font>" + val['productCode'] + "</font></font>";
                var p_description = val['description'];
                var p_price = "<button type='button' class='btn btn-submit modal-btn-buy'>" +
                              "<font>" + val['price'] + "</font>" +
                              "</button>";
                
                $('.item-details1').append(p_image + p_code);
                $('.item-details2').append(p_description);
                $('.item-details3').append(p_price);

                $('.modal-btn-buy').click(function(){
                    goToBuy(val['image'], val['productCode'], val['price']);    
                })

                closeModal();
            })

        })      
    }

    function navTabs(items){
       // Eload Tab
        $('.cat-item-eload').click(function(){
            $('.menu-table').hide().fadeIn().empty();
            var arr = categorizeMenu(items, 'Eload');
            loadMenu(arr);
        })

        // Call & Text Tab
        $('.cat-item-ct').click(function(){
            $('.menu-table').hide().fadeIn().empty();
            var arr = categorizeMenu(items, 'Call/Text');
            loadMenu(arr);
        })

        // Data Tab
        $('.cat-item-data').click(function(){
            $('.menu-table').hide().fadeIn().empty();
            var arr = categorizeMenu(items, 'Data');
            loadMenu(arr);
        }) 
    }

    function clickTelco(type){
        $('.telco-menu-cont').hide();
        $('.menu-table').fadeIn();
        var items = categorizeTelco(data, type);
        navTabs(items);
        loadMenu(items);
    }

    function clickProduct(type){
        $('.telco-menu-cont, .category-tab').hide();
        $('.menu-table').fadeIn();
        var items = categorizeTelco(data, type);
        //navTabs(items);
        loadMenu(items);
    }
   

    $('.back-to-menu').click(function(){
        location.reload();
    })

    // routerMac & userMac here
    buyItem('112233445566', '11:22:33:44:55:66'); // CC2DE0EDE9E2 CC2DE0446B5D


    
     
    




var data = [
    {
        "eLoad" : "Smart GaanTxt 10 (For Talk n Txt Subscriber Only)",
        "productCode" : "SMGT10",
        "description" : "unlimited texts to all network, valid for 1 day",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 15",
        "productCode" : "SM15",
        "description" : "15 airtime load",
        "price" : "Php 15.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 20",
        "productCode" : "SM20",
        "description" : "20 airtime load",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload Economy (P30)",
        "productCode" : "SM30",
        "description" : "30 airtime load",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 50",
        "productCode" : "SM50",
        "description" : "50 airtime load",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload Regular (P60)",
        "productCode" : "SM60",
        "description" : "60 airtime load",
        "price" : "Php 60.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 100",
        "productCode" : "SM100",
        "description" : "100 airtime load",
        "price" : "Php 100.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload Extra (P155)",
        "productCode" : "SM115",
        "description" : "115 airtime load",
        "price" : "Php 115.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 200",
        "productCode" : "SM200",
        "description" : "200 airtime + 30 all-net SMS",
        "price" : "Php 200.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 250",
        "productCode" : "SM250",
        "description" : "300 airtime + 33 all-net SMS",
        "price" : "Php 250.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 300",
        "productCode" : "SM300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 500",
        "productCode" : "SM500",
        "description" : "500 airtime + 83 all-net SMS",
        "price" : "Php 500.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Eload 1000",
        "productCode" : "SM1000",
        "description" : "1000 airtime + 250 all-net SMS",
        "price" : "Php 1000.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Text Plus 20",
        "productCode" : "SMAT20",
        "description" : "Unlitext to all network + 20 min calls to SMART, TNT, SUN + All day Chat and Surf",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart LahaTxt 20 (for Talk n Text subscriber only)",
        "productCode" : "SMLT20",
        "description" : "unlimited all-net texts",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart LahaTxt 30 (for Smart and TNT subscribers)",
        "productCode" : "SMLT30",
        "description" : "unlimited all-net texts",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart GaanTxt 20 (for Talk n Text subscriber only)",
        "productCode" : "SMGT20",
        "description" : "200 texts to all networks",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Text 10 (for Smart and TNT subscribers)",
        "productCode" : "SMAT10",
        "description" : "75 SMS to all network + 5MB data valid for 1 day",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart GaanTxt Plus 10 (for TNT subs only)",
        "productCode" : "SMGTP10",
        "description" : "100 TNT/SMART SMS/MMS + 10 Allnet SMS",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes 50",
        "productCode" : "SMBB50",
        "description" : "700MB + 600MB Spinnr, iflix, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes 70",
        "productCode" : "SMBB70",
        "description" : "1GB + 300MB Spinnr, iflix, YouTube, Vimeo, Dailymotion, Dubsmash & Skype Qik",
        "price" : "Php 70.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 15",
        "productCode" : "SMBRO15",
        "description" : "P15 airtime load valid for 15 days w/ free 45 minutes of browsing valid for 1 day",
        "price" : "Php 15.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 30",
        "productCode" : "SMBRO30",
        "description" : "P30 airtime load valid for 15 days w/ free 90 minutes of browsing valid for 3 days",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 50",
        "productCode" : "SMBRO50",
        "description" : "P50 airtime load valid for 15 days w/ free 150 minutes of browsing valid for 5 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 60",
        "productCode" : "SMBRO60",
        "description" : "P60 airtime load valid for 30 days w/ free 180 minutes of browsing valid for 6 days",
        "price" : "Php 60.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 100",
        "productCode" : "SMBRO100",
        "description" : "P100 airtime load valid for 30 days w/ free 300 minutes of browsing valid for 10 days",
        "price" : "Php 100.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 115",
        "productCode" : "SMBRO115",
        "description" : "P115 airtime load valid for 45 days w/ free 345 minutes of browsing valid for 12 days",
        "price" : "Php 115.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 200",
        "productCode" : "SMBRO200",
        "description" : "P200 airtime load + 30 all-net SMS valid for 60 days w/ free 600 minutes of browsing valid for 30 days",
        "price" : "Php 200.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 300",
        "productCode" : "SMBRO300",
        "description" : "P300 airtime load + 33 all-net SMS valid for 75 days w/ free 900 minutes of browsing valid for 60 days",
        "price" : "Php 300.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO 500",
        "productCode" : "SMBRO500",
        "description" : "P500 airtime load + 83 all-net SMS valid for 120 days w/ free 1500 minutes of browsing valid for 60 days",
        "price" : "Php 500.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 50",
        "productCode" : "SMBROSURFMAX50",
        "description" : "all day surfing Up to 800MB/day for 1 day",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 85",
        "productCode" : "SMBROSURFMAX85",
        "description" : "all day surfing Up to 800MB/day for 2 days",
        "price" : "Php 85.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 200",
        "productCode" : "SMBROSURFMAX200",
        "description" : "all day surfing Up to 800MB/day for 5 days",
        "price" : "Php 200.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 250",
        "productCode" : "SMBROSURFMAX250",
        "description" : "all day surfing Up to 800MB/day for 7 days",
        "price" : "Php 250.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 500",
        "productCode" : "SMBROSURFMAX500",
        "description" : "all day surfing Up to 800MB/day for 15 days",
        "price" : "Php 500.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BRO Surf Max 995",
        "productCode" : "SMBROSURFMAX995",
        "description" : "all day surfing Up to 800MB/day for 30 days",
        "price" : "Php 995.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max 50",
        "productCode" : "SMSURFMAX50",
        "description" : "2G/3G (where available) all day surfing for 1 day",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max 299",
        "productCode" : "SMSURFMAX299",
        "description" : "2G/3G All day surfing for 7 days",
        "price" : "Php 299.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max 999",
        "productCode" : "SMSURFMAX999",
        "description" : "3G all day surfing for 30 days",
        "price" : "Php 999.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max Plus 50",
        "productCode" : "SMSURFMAXPLS50",
        "description" : "4G/LTE all day surfing",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max Plus 299",
        "productCode" : "SMSURFMAXPLS299",
        "description" : "LTE All-day surfing for 7 days",
        "price" : "Php 299.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Surf Max Plus 995",
        "productCode" : "SMSURFMAXPLS995",
        "description" : "LTE All-day surfing for 30 days",
        "price" : "Php 995.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 50 (for Smart subscribers only)",
        "productCode" : "SMGS50",
        "description" : "1GB Shareable Data + 300MB for iflix, Spinnr ,YouTube, Vimeo, Dailymotion & Dubsmash for 3 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 99 (BRO)",
        "productCode" : "SMBROGS99",
        "description" : "1.5GB Shareable Data + 300MB for iflix, YouTube, Spinnr, Vimeo, Dailymotion, & Dubsmash for 7 days",
        "price" : "Php 99.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 20 (for Smart subscribers only)",
        "productCode" : "SMAOS20",
        "description" : "150MB Data, Free Facebook, Unli All-Net texts, 20 mins calls to Smart, TNT & Sun",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 30 (HERO OFFER) (for Smart sub)",
        "productCode" : "SMAOS30",
        "description" : "300MB Data, Free Facebook, Unli All-Net texts, 30 mins calls to Smart, TNT & Sun",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 50 (for Smart subscribers only)",
        "productCode" : "SMAOS50",
        "description" : "500MB Data, Free Facebook, Unli All-Net texts, 50 mins calls to Smart, TNT & Sun",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 99 (for Smart subscribers only)",
        "productCode" : "SMAOS99",
        "description" : "1GB Data, Free Facebook, Unli All-Net texts, 100 mins calls to Smart, TNT & Sun",
        "price" : "Php 99.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Sakto Surf 30 (for Smart subscribers only)",
        "productCode" : "SMSS30",
        "description" : "200MB + 20 minutes of calls to Smart, Sun & TNT valid for 7 days",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Sakto Surf 99 (for Smart subscribers only)",
        "productCode" : "SMSS99",
        "description" : "500MB + 70 minutes of calls to Smart, Sun & TNT valid for 30 days",
        "price" : "Php 99.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 50 (BRO)",
        "productCode" : "SMBROGS50",
        "description" : "1GB shareable data with 300 MB Entertainment bundle valid for 3 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Enhanced UCT 30 (for Smart subscribers only)",
        "productCode" : "SMUCT30",
        "description" : "100MB Data w/ Unli Trinet calls, Unli All Net SMS for 1 Day",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Enhanced UCT 50 (for Smart subscribers only)",
        "productCode" : "SMUCT50",
        "description" : "Unli Trinet Calls, UNLI AllNet SMS + 50MB internet valid for 3 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart UCT 100 (for Smart subscribers only)",
        "productCode" : "SMUCT100",
        "description" : "UNLI calls&texts to Smart/TNT, 80 texts to All Net & Free 30MB for chat & surf valid for 4 days",
        "price" : "Php 100.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart UCT 350 (for Smart subscribers only)",
        "productCode" : "SMUCT350",
        "description" : "Unli All-Net SMS + Unli Trinet Calls + 500MB Data valid for 30 days",
        "price" : "Php 350.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BigBytes 15 (for Smart subscribers only)",
        "productCode" : "SMBB15",
        "description" : "40 MB data with 300 MB for Spinnr for 2 days",
        "price" : "Php 15.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BigBytes 30 (for Smart subscribers only)",
        "productCode" : "SMBB30",
        "description" : "100 MB data with 400 MB for Spinnr for 1 day",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes Barkada 99 (for Smart subscribers",
        "productCode" : "SMBB99",
        "description" : "700MB valid for 7 days",
        "price" : "Php 99.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes Barkada 299 (for Smart subscribers",
        "productCode" : "SMBB299",
        "description" : "2GB valid for 30 days",
        "price" : "Php 299.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart SULITIDD50 (for Smart subscribers only)",
        "productCode" : "SMSIDD50",
        "description" : "IDD calls (50) valid for 15 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart SULITIDD100 (for Smart subscribers only)",
        "productCode" : "SMSIDD100",
        "description" : "IDD calls (100) valid for 30 days",
        "price" : "Php 100.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart SULITIDD500 (for Smart subscribers only)",
        "productCode" : "SMSIDD500",
        "description" : "IDD calls (500) valid for 90 days",
        "price" : "Php 500.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BigBytes 15 (Bro)",
        "productCode" : "SMBROBB15",
        "description" : "Unlimited Data valid for 2 days (Bro)",
        "price" : "Php 15.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Unli Call & Text 10 (for TNT subs only)",
        "productCode" : "TNTUCT10",
        "description" : "Unli Call & Text 10",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Facebook 10 (for TNT subs only)",
        "productCode" : "TNTFB10",
        "description" : "Facebook valid for 3 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Wattpad 10 (for TNT subs only)",
        "productCode" : "TNTWATPD10",
        "description" : "Wattpad valid for 3 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Viber 10 (for TNT subs only)",
        "productCode" : "TNTVIBR10",
        "description" : "Viber valid for 3 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Clash of Clans 10 (for TNT subs only)",
        "productCode" : "TNTCOC10",
        "description" : "Clash of clans valid for 3 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Twitter 10 (for TNT subs only)",
        "productCode" : "TNTTWTR10",
        "description" : "Twitter valid for 3 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT UnliTextPlus 10 (for TNT subs only)",
        "productCode" : "TNTUTP10",
        "description" : "Unli tri-net SMS, 50 all-net SMS, and 50 tri-net mins for 1 day",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT GaanSurf 10 (for TNT subs only)",
        "productCode" : "TNTGS10",
        "description" : "50 MB data with 100 MB Entertainment Bundle for 1 day",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Super Talk 10 (for TNT subs only)",
        "productCode" : "TNTST10",
        "description" : "unli trinet call, 50 texts + fb and messenger for 1 day",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Unlitext 10 (for TNT subs only)",
        "productCode" : "TNTUT10",
        "description" : "Unlimited Tri-net SMS valid for 2 days",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart Wonder (Load10) for Smart subs only",
        "productCode" : "SM10",
        "description" : "P10 airtime for 3 days",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes 10 (for Smart subs only)",
        "productCode" : "SMBB10",
        "description" : "40 MB data with 200 MB for Spinnr for 1 day",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart BigBytes 10 (SMBro)",
        "productCode" : "SMBROBB10",
        "description" : "40 MB data with 200 MB for Spinnr for 1 day",
        "price" : "Php 10.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Flexi Max 10 (for TNT subs only)",
        "productCode" : "TNTFM10",
        "description" : "Flexi Max 10",
        "price" : "Php 10.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT UnliTalk 15 (for TNT subs only)",
        "productCode" : "TNTUT15",
        "description" : "Unlimited On-net Calls valid for 1 day",
        "price" : "Php 15.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT UnliText Plus 15 (for TNT subs only)",
        "productCode" : "TNTUTP15",
        "description" : "Unlitxt + 10 mins calls to TNT/Smart/Sun + 50 all-net texts, 2 days",
        "price" : "Php 15.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Willie - Unlitxt 15 (for TNT subs only)",
        "productCode" : "TNTWUT15",
        "description" : "Willie - Unlitxt15",
        "price" : "Php 15.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Gaan UnliTxt 15 Plus (for TNT subs only)",
        "productCode" : "TNTGU15",
        "description" : "Gaan UnliTxt 15 Plus valid for 1day",
        "price" : "Php 15.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 15 (WEB) for Smart subs only",
        "productCode" : "SMWAO15",
        "description" : "20min Trinet Calls + Unli All-Net SMS + 150MB data + Unli FB valid for 1 day",
        "price" : "Php 15.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT GaanSurf 15 (for TNT subs only)",
        "productCode" : "TNTGS15",
        "description" : "100 MB data with 100 MB Entertainment Bundle for 2 days",
        "price" : "Php 15.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Panalo IDD 20 (for TNT subs only)",
        "productCode" : "TNTPIDD20",
        "description" : "Panalo IDD 20 for 1 day",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Unli Talk Plus 20 (for TNT subs only)",
        "productCode" : "TNTUTP20",
        "description" : "Unli all-net SMS, Unli Tri-net calls, 100MB Tropa Apps for 1 day",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Kamustext 20 (for TNT subs only)",
        "productCode" : "TNTINTL20",
        "description" : "50 Local Allnet and Intl SMS valid for 1 day",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Super Combo 20 (for TNT subs only)",
        "productCode" : "TNTSC20",
        "description" : "Unli Trinet SMS and calls + 50MB data valid for 2 days",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT All Day 20 (for TNT subs only)",
        "productCode" : "TNTAD20",
        "description" : "Unlimited browsing for 1 day, streaming and downloads not included",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT GaanSurf 20 (for TNT subs only)",
        "productCode" : "TNTGS20",
        "description" : "200 MB data with 100 MB Entertainment Bundle for 3 days",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Willie - UnliTxt 20 (for TNT subs only)",
        "productCode" : "TNTWUT20",
        "description" : "Willie - UnliTxt20",
        "price" : "Php 20.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart All Out Surf 20 (WEB) for Smart subs only",
        "productCode" : "SMWAO20",
        "description" : "20min Trinet Calls + Unli All-Net SMS + 150MB data + Unli FB valid for 1 day",
        "price" : "Php 20.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart All-in 25 (for Smart subs only)",
        "productCode" : "SMAI25",
        "description" : "Unli All-Net SMS + 60 mins of Trinet calls + 10 MB data valid for 1 day",
        "price" : "Php 25.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Unlimited Call and Text 25 (UCT 25) for Smart subs only",
        "productCode" : "SMUCT25",
        "description" : "Unli On-net calls,Unli Trinet SMS, 50 All-Net SMS, Free Viber + FB for 1day",
        "price" : "Php 25.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Unli Text 2 All Plus 25 (for TNT subs only)",
        "productCode" : "TNTUTP25",
        "description" : "Unli Allnet SMS + 60mins Trinet calls valid for 3 days",
        "price" : "Php 25.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart BigBytes 30 (SMBro)",
        "productCode" : "SMBROBB30",
        "description" : "100 MB data with 400 MB for Spinnr for 1 day",
        "price" : "Php 30.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT GaanSurf 30 (for TNT subs only)",
        "productCode" : "TNTGS30",
        "description" : "300 MB data with 200 MB Entertainment Bundle for 5 days",
        "price" : "Php 30.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Flexi 30 (for TNT subs only)",
        "productCode" : "TNTFIDD30",
        "description" : "6 IDD mins or Intl SMS valid for 3 days",
        "price" : "Php 30.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Unlitext Extra 30 (for TNT subs only)",
        "productCode" : "TNTUT30",
        "description" : "Unli All-net SMS, 100mins Tri-net calls, 100MB Tropa Apps for 3days",
        "price" : "Php 30.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Unli All Text 30 (for TNT subs only)",
        "productCode" : "TNTUAT30",
        "description" : "Unlimited all-net SMS for 5 days",
        "price" : "Php 30.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT All Day 30 (for TNT subs only)",
        "productCode" : "TNTAD30",
        "description" : "500 MB Data, FB valid for 2 days",
        "price" : "Php 30.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 50 (SMBro)",
        "productCode" : "SMBROBB50",
        "description" : "1GB shareable data with 300 MB Entertainment bundle valid for 3 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT SURFMAX 50 (for TNT subs only)",
        "productCode" : "TNTSFMX50",
        "description" : "Unlimited Data valid for 1 day",
        "price" : "Php 50.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Panalo IDD 50 (for TNT subs only)",
        "productCode" : "TNTPIDD50",
        "description" : "Panalo IDD 50 for 15 days",
        "price" : "Php 50.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart UnliTxtPlus 50 (for Smart subs only)",
        "productCode" : "SMUTP50",
        "description" : "25mb volume data + unli Trinet SMS + unli Trinet Calls valid for 5 days",
        "price" : "Php 50.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Flexi 50 (for TNT subs only)",
        "productCode" : "TNTFIDD50",
        "description" : "5 IDD mins or Intl SMS valid for 7 days",
        "price" : "Php 50.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart Unlitext2All Plus 60 (UAPlus60) for Smart,TNT",
        "productCode" : "SMUAP60",
        "description" : "Unli Allnet SMS + 100mins Trinet calls + 500MB data valid for 7 days",
        "price" : "Php 60.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Big Bytes 70 (SMBro)",
        "productCode" : "SMBROBB70",
        "description" : "1GB open access data + 300MB Data Sampler + 1000 Tri-Net SMS valid for 7 days",
        "price" : "Php 70.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 99 (for Smart subs only)",
        "productCode" : "SMGS99",
        "description" : "2GB open access data, unli AllNet SMS valid for 7 days",
        "price" : "Php 99.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Unlitalk Plus 100 (for TNT subs only)",
        "productCode" : "TNTUP100",
        "description" : "Unli All-net SMS, Unli Tri-net calls, 100MB Tropa Apps for 7days",
        "price" : "Php 100.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "TNT Willie - UnliTxt 150 (for TNT subs only)",
        "productCode" : "TNTWUT150",
        "description" : "150 All-net SMS, 150 mins Tri-net calls for 30 days",
        "price" : "Php 150.00",
        "network" : "TNT",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart Mega All-in 250 (for Smart subs only)",
        "productCode" : "SMMAI250",
        "description" : "Unli AllNet SMS and 180 Mins to Smart/Sun/TNT+100MB Data valid 30 Days",
        "price" : "Php 250.00",
        "network" : "Smart",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT SURFMAX 299 (for TNT subs only)",
        "productCode" : "TNTSFMX299",
        "description" : "Unlimited Data valid for 7 days",
        "price" : "Php 299.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 299 (SMBro)",
        "productCode" : "SMBROGS299",
        "description" : "2GB of open access volume data with 1.1GB Entertainment Bundle valid for 30 days",
        "price" : "Php 299.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 299 (for Smart subs only)",
        "productCode" : "SMGS299",
        "description" : "2GB open access data, unli AllNet SMS valid for 7 days",
        "price" : "Php 299.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 799 (for Smart subs only)",
        "productCode" : "SMGS799",
        "description" : "4.5GB of open access volume data with 1.1GB Entertainment Bundle valid for 30 days",
        "price" : "Php 799.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Giga Surf 799 (SMBro)",
        "productCode" : "SMBROGS799",
        "description" : "4.5GB of open access volume data with 1.1GB Entertainment Bundle valid for 30 days",
        "price" : "Php 799.00",
        "network" : "Smart",
        "category" : "Data",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "TNT Panalo Data 60 (TNT)",
        "productCode" : "TNTWPDATA60",
        "description" : "1GB open access data + unli allnet SMS valid for 5 days",
        "price" : "Php 60.00",
        "network" : "TNT",
        "category" : "Data",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 10",
        "productCode" : "GMX10",
        "description" : "P10",
        "price" : "Php 10.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 100 (for Globe and TM)",
        "productCode" : "GMX100",
        "description" : "P100",
        "price" : "Php 100.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 350 (for Globe and TM)",
        "productCode" : "GMX350",
        "description" : "P350",
        "price" : "Php 350.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 450 (for Globe and TM)",
        "productCode" : "GMX450",
        "description" : "P450",
        "price" : "Php 450.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 550 (for Globe and TM)",
        "productCode" : "GMX550",
        "description" : "P550",
        "price" : "Php 550.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 600 (for Globe and TM)",
        "productCode" : "GMX600",
        "description" : "P600",
        "price" : "Php 600.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 700 (for Globe and TM)",
        "productCode" : "GMX700",
        "description" : "P700",
        "price" : "Php 700.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe Amax 900 (for Globe and TM)",
        "productCode" : "GMX900",
        "description" : "P900",
        "price" : "Php 900.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO UNLI 20",
        "productCode" : "GOUNLI20",
        "description" : "Unli Calls to GP/TM, 20 Allnet texts + 15MB, P20 for 1 Day",
        "price" : "Php 20.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO UNLI 25",
        "productCode" : "GOUNLI25",
        "description" : "Unli Calls to GP/TM, Unli Allnet texts, Unli Viber Chat, P25 for 1 Day",
        "price" : "Php 25.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO UNLI 50",
        "productCode" : "GOUNLI50",
        "description" : "Unli Calls to GP/TM, Unli Allnet texts + 50MB, P50 for 3 days",
        "price" : "Php 50.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile GoSurf 10",
        "productCode" : "GOSURF10",
        "description" : "40MB + 200MB SPOTIFY Basic + 50 MB Youtube & Daily Motion + HOOQ Trial Access for P10, 1 Day",
        "price" : "Php 10.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile GoSurf 15",
        "productCode" : "GOSURF15",
        "description" : "Consumable 40MB with FREE 30MB of Snapchat. P15/2days",
        "price" : "Php 15.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile GoSurf 50",
        "productCode" : "GOSURF50",
        "description" : "Consumable 700MB + 300MB for 1 chosen freebie. P50/3 days",
        "price" : "Php 50.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO TIPIDD 30",
        "productCode" : "GOTIPIDD30",
        "description" : "Call 200+ countries for as low as P2.50/min for only P30 valid for 3 days",
        "price" : "Php 30.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO TIPIDD 100",
        "productCode" : "GOTIPIDD100",
        "description" : "Call 200+ countries for as low as P2.50/min for only P100 valid for 15 days",
        "price" : "Php 100.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile Super Surf 50",
        "productCode" : "SUPERSURF50",
        "description" : "Php 50 per day surf-all-you-want internet",
        "price" : "Php 50.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile Super Surf 120",
        "productCode" : "SUPERSURF120",
        "description" : "3 days surf-all-you-want internet",
        "price" : "Php 120.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe & Touch Mobile Super Surf 200",
        "productCode" : "SUPERSURF200",
        "description" : "5 days surf-all-you-want internet",
        "price" : "Php 200.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO CALL 30",
        "productCode" : "GOCALL30",
        "description" : "Unli Calls to GP/TM + 30MB, P30 valid 3 Days",
        "price" : "Php 30.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile Combo 20",
        "productCode" : "COMBO20",
        "description" : "Unli Allnet Texts + 60 mins Calls to TM/Globe, P20 for 4 Days",
        "price" : "Php 20.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile Unli Txt 10 (TM & Globe)",
        "productCode" : "TXT10",
        "description" : "Unli text to Globe/TM,P10 for 2 Days",
        "price" : "Php 10.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile Unli Txt 10 (all network)",
        "productCode" : "UA10",
        "description" : "Unli Allnet texts, P10 for 1 day",
        "price" : "Php 10.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile Astig Txt 20",
        "productCode" : "ASTIGITXT20",
        "description" : "30 SMS to ALL NETWORK in 49 defined countries for P20/ 1 day",
        "price" : "Php 20.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile TIPIDD 30",
        "productCode" : "TIPIDD30",
        "description" : "4 IDD minutes to Saudi, UAE, Kuwait, Bahrain, Italy, UK, Australia at Japan for P30/ 1 day",
        "price" : "Php 30.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Globe GO UNLITXT 15",
        "productCode" : "GOUNLITXT15",
        "description" : "Unli Allnet texts + 30MB, P15 for 3 days",
        "price" : "Php 15.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO TXT 20",
        "productCode" : "GOTXT20",
        "description" : "Unli allnet SMS + 20MB, P20 valid 3days",
        "price" : "Php 20.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO UNLI 30 (USSD)",
        "productCode" : "USSDGOUNLI30",
        "description" : "Unli Calls to GP/TM, Unli Allnet texts, +Unli Chat, P30 for 1 Day",
        "price" : "Php 30.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "TM COMBO ALL 10",
        "productCode" : "COMBOALL10",
        "description" : "Unli Calls & Text to TM/Globe + 50 AllNet Texts, P10 for 1 Day",
        "price" : "Php 10.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "TM UNLI CALL 10",
        "productCode" : "UC10",
        "description" : "Unli Calls to TM/Globe + 100 AllNet Texts, P20 for 2 Days",
        "price" : "Php 10.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "TM CALL & ALL NET TXT 15",
        "productCode" : "CA15",
        "description" : "Unli Calls & Text to TM/Globe + 50 AllNet Texts, P15 for 2 Days",
        "price" : "Php 15.00",
        "network" : "TM",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Globe SURF 20",
        "productCode" : "SURF20",
        "description" : "400MB for P20 for 1 Day",
        "price" : "Php 20.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF 30",
        "productCode" : "GOSURF30",
        "description" : "Consumable 150MB + 50MB for 1 chosen freebie. P30/2 days",
        "price" : "Php 30.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF 299",
        "productCode" : "GOSURF299",
        "description" : "Consumable 1.5GB + 1GB for 1 chosen freebie. P299/30 days.",
        "price" : "Php 299.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF 999",
        "productCode" : "GOSURF999",
        "description" : "Consumable 6GB + 1GB for 1 chosen freebie. P999/30 days",
        "price" : "Php 999.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF MB 10",
        "productCode" : "GOSURFMB10",
        "description" : "Consumable 40MB mobile internet. P10/1day",
        "price" : "Php 10.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF MB 15",
        "productCode" : "GOSURFMB15",
        "description" : "Consumable 40MB with FREE 30MB of Snapchat. P15/2days",
        "price" : "Php 15.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF MB 30",
        "productCode" : "GOSURFMB30",
        "description" : "Consumable 150MB + 50MB for 1 chosen freebie. P30/2 days",
        "price" : "Php 30.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO SURF MB 50",
        "productCode" : "GOSURFMB50",
        "description" : "Consumable 700MB + 300MB for 1 chosen freebie. P50/3 days",
        "price" : "Php 50.00",
        "network" : "Globe",
        "category" : "Data",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe CHAT PLUS 25",
        "productCode" : "CHATPLUS25",
        "description" : "15 IDD minutes to the US & Canada + ALL-Day access to FB Messenger, Viber, Kakaotalk, WeChat, WhatsAPP & Google Messenger",
        "price" : "Php 25.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe GO TIPIDD 100",
        "productCode" : "USSDGOTIPIDD100",
        "description" : "Call 200+ countries for as low as P2.50/min for only P100 valid for 15 days",
        "price" : "Php 100.00",
        "network" : "Globe",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 10",
        "productCode" : "SNX10",
        "description" : "10 regular load",
        "price" : "Php 10.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 15",
        "productCode" : "SNX15",
        "description" : "15 regular load",
        "price" : "Php 15.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 20",
        "productCode" : "SNX20",
        "description" : "20 regular load + 4 FREE Text",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 25",
        "productCode" : "SNX25",
        "description" : "25 + 2 texts to ALL networks",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 30",
        "productCode" : "SNX30",
        "description" : "30 regular load + 8 FREE Text",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 50",
        "productCode" : "SNX50",
        "description" : "5 on-net SMS + P50 airtime",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 75",
        "productCode" : "SNX75",
        "description" : "75 + 12 texts to ALL networks",
        "price" : "Php 75.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 100",
        "productCode" : "SNX100",
        "description" : "10 On-net SMS + P100 airtime",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 150",
        "productCode" : "SNX150",
        "description" : "150 + 25 texts to ALL networks",
        "price" : "Php 150.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 300",
        "productCode" : "SNX300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload 500",
        "productCode" : "SNX500",
        "description" : "83 all-net SMS + P500 airtime",
        "price" : "Php 500.00",
        "network" : "Sun",
        "category" : "Eload",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Budgetxt 5 (sell at P7.00 at least)",
        "productCode" : "SNXBGT5",
        "description" : "10 texts to ALL networks",
        "price" : "Php 5.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Budgetxt 20",
        "productCode" : "SNXBGT20",
        "description" : "40 texts to ALL networks",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Winner Txt 10",
        "productCode" : "SNXWIN10",
        "description" : "Unlimited Sun texts, 10 minutes Trinet (Sun, Smart, Talk ‘N Text) calls, and (10 minutes mobile internet) Free Facebook for 1 day",
        "price" : "Php 10.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text Unli 20",
        "productCode" : "SNXTU20",
        "description" : "Unlimited Sun texts, 20 minutes Sun calls 50 texts to other networks Free Facebook for 3 days",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text Unli 50",
        "productCode" : "SNXTU50",
        "description" : "Unlimited Sun texts, 60 minutes Sun calls Free Facebook Nonstop Chat** for 10 days",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text Unli 60",
        "productCode" : "SNXTU60",
        "description" : "Unlimited Sun texts, 60 minutes Trinet (Sun, Smart, Talk ‘N Text) calls, 200 texts to other networks Free Facebook Nonstop Chat** for 10 days",
        "price" : "Php 60.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text Unli 200",
        "productCode" : "SNXTU200",
        "description" : "Unlimited Sun texts, 4 hours Sun calls, 1,000 texts to other networks",
        "price" : "Php 200.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text Unli 300",
        "productCode" : "SNXTU300",
        "description" : "Unlimited Sun texts, 5 hours of Trinet (Sun, Smart & Talk ‘N Text) calls, 1,500 texts to other networks",
        "price" : "Php 300.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Combo 10",
        "productCode" : "SNXCTC10",
        "description" : "50 texts to other networks, 50 Sun Texts, 10 minutes calls to Sun, Smart & Talk 'N Text, (10 minutes of mobile internet) Free Facebook",
        "price" : "Php 10.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Combo 20",
        "productCode" : "SNXCTC20",
        "description" : "100 texts to other networks, 100 Sun texts, 25 minutes of calls to Sun, Smart & Talk N' Text Free Facebook",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Combo 30",
        "productCode" : "SNXCTC30",
        "description" : "150 texts to other networks, 150 Sun texts, 40 minutes of calls to Sun, Smart & Talk N' Text Free Facebook Nonstop Chat**",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Combo 50",
        "productCode" : "SNXCTC50",
        "description" : "250 texts to other networks, 250 Sun texts, 70 minutes of calls to Sun, Smart & Talk N' Text Free Facebook Nonstop Chat**",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Call & Text Unlimited 25",
        "productCode" : "SNXCTU25",
        "description" : "Unlimited texts to All Networks, Unlimited Calls to Sun, and Unlimited Facebook valid for 1 day",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Combo 150",
        "productCode" : "SNXCTC150",
        "description" : "PLUS! Nonstop Chat (Viber, WeChat, LINE, Facebook Messenger, WhatsApp)",
        "price" : "Php 150.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Unli 50",
        "productCode" : "SNXCTU50",
        "description" : "Unlimited Trinet Calls (Smart, Sun, and Talk 'N Text), Unlimited all-net texts, Free Facebook",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Unli 100",
        "productCode" : "SNXCTU100",
        "description" : "Unlimited texts to All networks, Unlimited calls to Sun, Smart & Talk ‘N Text, 100 MB surf for 7 days",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Unli 150",
        "productCode" : "SNXCTU150",
        "description" : "Unlitxt all network + unlicall Smart, tnt, Sun + 25 regular load +unli fb",
        "price" : "Php 150.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Unli 450",
        "productCode" : "SNXCTU450",
        "description" : "Unlimited Sun-to-Sun Calls and Texts + P50 Regular Load Unlimited Trinet Calls (Smart, Sun, and Talk 'N Text) Unlimited all-net texts, Free Facebook Non-stop Chat** Spinnr access, P50 regular load for 30 days",
        "price" : "Php 450.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Sulit Calls 30",
        "productCode" : "SNXSULIT30",
        "description" : "1 hour of Sun-to-Sun calls",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Daylight Call & Text Unli 100",
        "productCode" : "SNXDCTU100",
        "description" : "Unlimited sun call (12mid to 6Pm) + unlitxt sun to tun (24 hrs)",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload IDD Top 10 50",
        "productCode" : "SNXTODOIDD50",
        "description" : "P2.00/min US CANADA HONGKONG SINGAPORE CHINA GUAM HAWAII/ P5.00/min Australia, Malaysia, South Korea, Taiwan, Macau, Thailand, India, Brunei/ P8.00/min Japan, Italy. Bharain, Kuwait/ P10/min Saudi UAE UK Indonesia Spain France",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload IDD Top 10 100",
        "productCode" : "SNXTODOIDD100",
        "description" : "P2.00/min US CANADA HONGKONG SINGAPORE CHINA GUAM HAWAII/ P5.00/min Australia, Malaysia, South Korea, Taiwan, Macau, Thailand, India, Brunei/ P8.00/min Japan, Italy. Bharain, Kuwait/ P10/min Saudi UAE UK Indonesia Spain France",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload IDD Top 10 300",
        "productCode" : "SNXTODOIDD300",
        "description" : "P2.00/min US CANADA HONGKONG SINGAPORE CHINA GUAM HAWAII/ P5.00/min Australia, Malaysia, South Korea, Taiwan, Macau, Thailand, India, Brunei/ P8.00/min Japan, Italy. Bharain, Kuwait/ P10/min Saudi UAE UK Indonesia Spain France",
        "price" : "Php 300.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Broadband Wireless 50",
        "productCode" : "SNXSBW50",
        "description" : "Unlimited Internet Surfing valid for 1 day",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Broadband Wireless 100",
        "productCode" : "SNXSBW100",
        "description" : "Unlimited Internet Surfing valid for 3 day",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Broadband Wireless 250",
        "productCode" : "SNXSBW250",
        "description" : "Unlimited Internet Surfing valid for7 day",
        "price" : "Php 250.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Broadband Wireless 300",
        "productCode" : "SNXSBW300",
        "description" : "Unlimited Internet Surfing valid for 15 day",
        "price" : "Php 300.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Flexi Load 30",
        "productCode" : "SNXFLEXI30",
        "description" : ".25 SUN-SUN Text, .50 other network, .50/min sun-sun call 5.50/min other network",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Flexi Load 50",
        "productCode" : "SNXFLEXI50",
        "description" : "25 SUN-SUN Text, .50 other network, .50/min sun-sun call 5.50/min other network",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Mobile Internet 25",
        "productCode" : "SNXI25",
        "description" : "3 hours of Mobile Internet valid for 1 day",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Mobile Internet 50",
        "productCode" : "SNXI50",
        "description" : "Unlimited Mobile Internet valid for 1 day",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Mobile Internet 999",
        "productCode" : "SNXI999",
        "description" : "Unlimited Mobile Internet valid for 30 days",
        "price" : "Php 999.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Unlimited Mix 25",
        "productCode" : "SNXUMIX25",
        "description" : "Unlitxt sun-sun 20 txt to other network 15mins mobile internet 15mins every hour sun to sun calls",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Unlimited Mix 100",
        "productCode" : "SNXUMIX100",
        "description" : "Unlitxt sun-sun 100 txt to other network 75mins mobile internet 15mins every hour sun to sun calls",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text All 15",
        "productCode" : "SNXTEXTALL15",
        "description" : "Unli Sun SMS + 10 mins Trinet calls + 20 SMS to other networks valid for 2 days",
        "price" : "Php 15.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload UTextAll 20",
        "productCode" : "SNXUTEXTALL20",
        "description" : "Unli Sun SMS + 20 mins Trinet Calls + 50 SMS to other networks valid for 2 days",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Unli Text Trio 20",
        "productCode" : "SNXUTEXTRIO20",
        "description" : "Unlimited texts to Sun, Smart & Talk 'N Text, Unlimited Facebook",
        "price" : "Php 20.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text All Plus 25",
        "productCode" : "SNXTAPLUS25",
        "description" : "Unlimited text to All Networks, 60 minutes Sun to Sun calls, 30 minutes Mobile internet",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Text All Plus 100",
        "productCode" : "SNXTAPLUS100",
        "description" : "Unlimited text to All Networks, 60 minutes Sun to Sun calls, 60 minutes Mobile internet",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Call & Text Unli 30",
        "productCode" : "SNXCTU30",
        "description" : "Unlimited Trinet calls (Sun, Smart & Talk ‘N Text) Unlimited all-net texts Free Facebook Nonstop Chat** for 1 day",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Todo IDD Combo 30",
        "productCode" : "SNXIDDCOMBO30",
        "description" : "PHP30 worth of IDD calls plus 40 Sun texts, 40 texts to other networks and 10 minutes of calls to Sun",
        "price" : "Php 30.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Trinet 300",
        "productCode" : "SNXTRINET300",
        "description" : "Unlimited texts to Sun, Smart & Talk 'N Text, 300 minutes of calls to Sun, Smart & Talk 'N Text, Unlimited Facebook",
        "price" : "Php 300.00",
        "network" : "Sun",
        "category" : "Call/Text",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Nonstop 25",
        "productCode" : "SNXNONSTOP25",
        "description" : "Non-stop surfing 25MB Open Access 300MB Spinnr Access & Streaming",
        "price" : "Php 25.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Nonstop 50",
        "productCode" : "SNXNONSTOP50",
        "description" : "Non-stop surfing 100MB Open Access 500MB Spinnr Access & Streaming",
        "price" : "Php 50.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Nonstop 100",
        "productCode" : "SNXNONSTOP100",
        "description" : "Non-stop surfing 250MB Open Access 1000MB Spinnr Access & Streaming",
        "price" : "Php 100.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Sun Xpressload Nonstop 450",
        "productCode" : "SNXNONSTOP450",
        "description" : "Non-stop surfing 500MB 1000MB Spinnr",
        "price" : "Php 450.00",
        "network" : "Sun",
        "category" : "Data",
        "image" : "<img src='/static/img/sun_logo.png'>"
    },
    {
        "eLoad" : "Smart Buddy 100",
        "productCode" : "SB100",
        "description" : "10 On-net SMS + P100 airtime",
        "price" : "Php 100.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Buddy 300",
        "productCode" : "SB300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Smart Buddy 500",
        "productCode" : "SB500",
        "description" : "83 all-net SMS + P500 airtime",
        "price" : "Php 500.00",
        "network" : "Smart",
        "category" : "Eload",
        "image" : "<img src='/static/img/smart_logo.png'>"
    },
    {
        "eLoad" : "Talk N Text 100",
        "productCode" : "TNT100",
        "description" : "10 On-net SMS + P100 airtime",
        "price" : "Php 100.00",
        "network" : "TNT",
        "category" : "Eload",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Talk N Text 300",
        "productCode" : "TNT300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "TNT",
        "category" : "Eload",
        "image" : "<img src='/static/img/tnt_logo.png'>"
    },
    {
        "eLoad" : "Globe 100",
        "productCode" : "GPH100",
        "description" : "10 On-net SMS + P100 airtime",
        "price" : "Php 100.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe 300",
        "productCode" : "GPH300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Globe 500",
        "productCode" : "GPH500",
        "description" : "83 all-net SMS + P500 airtime",
        "price" : "Php 500.00",
        "network" : "Globe",
        "category" : "Eload",
        "image" : "<img src='/static/img/globe_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile 50",
        "productCode" : "TM50",
        "description" : "5 on-net SMS + P50 airtime",
        "price" : "Php 50.00",
        "network" : "TM",
        "category" : "Eload",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile 100",
        "productCode" : "TM100",
        "description" : "10 On-net SMS + P100 airtime",
        "price" : "Php 100.00",
        "network" : "TM",
        "category" : "Eload",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Touch Mobile 300",
        "productCode" : "TM300",
        "description" : "33 all-net SMS + P300 airtime",
        "price" : "Php 300.00",
        "network" : "TM",
        "category" : "Eload",
        "image" : "<img src='/static/img/tm_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 50 (100 Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH50",
        "description" : "100 Points Ragnarok Journey Philippines",
        "price" : "Php 50.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 100 (200 Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH100",
        "description" : "200 Points Ragnarok Journey Philippines",
        "price" : "Php 100.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 250 (500 Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH250",
        "description" : "500 Points Ragnarok Journey Philippines",
        "price" : "Php 250.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 500 (1k Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH500",
        "description" : "1k Points Ragnarok Journey Philippines",
        "price" : "Php 500.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 750 (1.5 Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH750",
        "description" : "1.5K Points Ragnarok Journey Philippines",
        "price" : "Php 750.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 1000 (2k Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH1000",
        "description" : "2k Points Ragnarok Journey Philippines",
        "price" : "Php 1000.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 1500 (3k Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH1500",
        "description" : "3k Points Ragnarok Journey Philippines",
        "price" : "Php 1500.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Warpportal PH 2500 (5k Points Ragnarok Journey Philippines)",
        "productCode" : "WPPH2500",
        "description" : "5k Points Ragnarok Journey Philippines",
        "price" : "Php 2500.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P20 (zGold-MOLPoints)",
        "productCode" : "MLBB20",
        "description" : "20 zGold-MOLPoints",
        "price" : "Php 20.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P50 (zGold-MOLPoints)",
        "productCode" : "MLBB50",
        "description" : "50 zGold-MOLPoints",
        "price" : "Php 50.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P100 (zGold-MOLPoints)",
        "productCode" : "MLBB100",
        "description" : "100 zGold-MOLPoints",
        "price" : "Php 100.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P300 (zGold-MOLPoints)",
        "productCode" : "MLBB300",
        "description" : "300 zGold-MOLPoints",
        "price" : "Php 300.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P500 (zGold-MOLPoints)",
        "productCode" : "MLBB500",
        "description" : "500 zGold-MOLPoints",
        "price" : "Php 500.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Mobile Legends P1000 (zGold-MOLPoints)",
        "productCode" : "MLBB1000",
        "description" : "1000 zGold-MOLPoints",
        "price" : "Php 1000.00",
        "network" : "MobileLegends",
        "category" : "",
        "image" : "<img src='/static/img/mobilelegends_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 20",
        "productCode" : "Razer20",
        "description" : "Razer PIN 20",
        "price" : "Php 20.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 50",
        "productCode" : "Razer50",
        "description" : "Razer PIN 50",
        "price" : "Php 50.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 100",
        "productCode" : "Razer100",
        "description" : "Razer PIN 100",
        "price" : "Php 100.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 150",
        "productCode" : "Razer150",
        "description" : "Razer PIN 150",
        "price" : "Php 150.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 250",
        "productCode" : "Razer250",
        "description" : "Razer PIN 250",
        "price" : "Php 250.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 300",
        "productCode" : "Razer300",
        "description" : "Razer PIN 300",
        "price" : "Php 300.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 500",
        "productCode" : "Razer500",
        "description" : "Razer PIN 500",
        "price" : "Php 500.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 1000",
        "productCode" : "Razer1000",
        "description" : "Razer PIN 1000",
        "price" : "Php 1000.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 2000",
        "productCode" : "Razer2000",
        "description" : "Razer PIN 2000",
        "price" : "Php 2000.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "Razer PIN 5000",
        "productCode" : "Razer5000",
        "description" : "Razer PIN 5000",
        "price" : "Php 5000.00",
        "network" : "Razer",
        "category" : "",
        "image" : "<img src='/static/img/razer_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 65 (equiv to Steam Wallet PHP50)",
        "productCode" : "STEAM65",
        "description" : "equiv to Steam Wallet PHP50",
        "price" : "Php 65.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 130 (equiv Steam Wallet PHP100)",
        "productCode" : "STEAM130",
        "description" : "equiv Steam Wallet PHP100",
        "price" : "Php 130.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 325 (equiv Steam Wallet PHP250)",
        "productCode" : "STEAM325",
        "description" : "equiv Steam Wallet PHP250",
        "price" : "Php 325.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 645 (equiv Steam Wallet PHP500)",
        "productCode" : "STEAM645",
        "description" : "equiv Steam Wallet PHP500",
        "price" : "Php 645.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 1025 (equiv Steam Wallet PHP800)",
        "productCode" : "STEAM1025",
        "description" : "equiv Steam Wallet PHP800",
        "price" : "Php 1025.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 1285 (equiv Steam Wallet PHP1000)",
        "productCode" : "STEAM1285",
        "description" : "equiv Steam Wallet PHP1000",
        "price" : "Php 1285.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "STEAM WALLET CODE 2820 (equiv Steam Wallet PHP2200)",
        "productCode" : "STEAM2820",
        "description" : "equiv Steam Wallet PHP2200",
        "price" : "Php 2820.00",
        "network" : "Steam",
        "category" : "",
        "image" : "<img src='/static/img/steam_logo.png'>"
    },
    {
        "eLoad" : "Blizzard Battle.net Balance 250 (5 USD)",
        "productCode" : "BLIZZARD250",
        "description" : "5 USD",
        "price" : "Php 250.00",
        "network" : "Blizzard",
        "category" : "",
        "image" : "<img src='/static/img/blizzard_logo.png'>"
    },
    {
        "eLoad" : "Blizzard Battle.net Balance 500 (10 USD)",
        "productCode" : "BLIZZARD500",
        "description" : "10 USD",
        "price" : "Php 500.00",
        "network" : "Blizzard",
        "category" : "",
        "image" : "<img src='/static/img/blizzard_logo.png'>"
    },
    {
        "eLoad" : "Blizzard Battle.net Balance 1000 (20 USD)",
        "productCode" : "BLIZZARD1000",
        "description" : "20 USD",
        "price" : "Php 1000.00",
        "network" : "Blizzard",
        "category" : "",
        "image" : "<img src='/static/img/blizzard_logo.png'>"
    },
    {
        "eLoad" : "Garena 10 (10 Shells)",
        "productCode" : "GM10",
        "description" : "10 Shells",
        "price" : "Php 10.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 20 (20 Shells)",
        "productCode" : "GM20",
        "description" : "20 Shells",
        "price" : "Php 20.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 50 (50 Shells)",
        "productCode" : "GM50",
        "description" : "50 Shells",
        "price" : "Php 50.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 100 (100 Shells)",
        "productCode" : "GM100",
        "description" : "100 Shells",
        "price" : "Php 100.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 200 (200 Shells)",
        "productCode" : "GM200",
        "description" : "200 Shells",
        "price" : "Php 200.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 300 (300 Shells)",
        "productCode" : "GM300",
        "description" : "300 Shells",
        "price" : "Php 300.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 500 (500 Shells)",
        "productCode" : "GM500",
        "description" : "500 Shells",
        "price" : "Php 500.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "Garena 1000 (1000 Shells)",
        "productCode" : "GM1000",
        "description" : "1000 Shells",
        "price" : "Php 1000.00",
        "network" : "Garena",
        "category" : "",
        "image" : "<img src='/static/img/garena_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 20 (for Ragnarok Philippines)",
        "productCode" : "EXCASH20",
        "description" : "200 ROK Points",
        "price" : "Php 20.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 50 (for Ragnarok Philippines)",
        "productCode" : "EXCASH50",
        "description" : "500 ROK Points",
        "price" : "Php 50.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 100 (for Ragnarok Philippines)",
        "productCode" : "EXCASH100",
        "description" : "1000 ROK Points",
        "price" : "Php 100.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 300 (for Ragnarok Philippines)",
        "productCode" : "EXCASH300",
        "description" : "3100 ROK Points (3000 + Promotion 100 RP)",
        "price" : "Php 300.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 500 (for Ragnarok Philippines)",
        "productCode" : "EXCASH500",
        "description" : "5250 ROK Points (5000 + Promotion 250 RP)",
        "price" : "Php 500.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "EX Cash 1000 (for Ragnarok Philippines)",
        "productCode" : "EXCASH1000",
        "description" : "11000 ROK Points (10000 + Promotion 1000 RP)",
        "price" : "Php 1000.00",
        "network" : "Ragnarok",
        "category" : "",
        "image" : "<img src='/static/img/ragnarok_logo.png'>"
    },
    {
        "eLoad" : "CHERRY CREDITS 4200 (100000 CC)",
        "productCode" : "CC4200",
        "description" : "100000 CC",
        "price" : "Php 4200.00",
        "network" : "CherryCredits",
        "category" : "",
        "image" : "<img src='/static/img/cherrycredits_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP20 (4 R-Coins)",
        "productCode" : "RCOIN20",
        "description" : "4 R-Coins",
        "price" : "Php 20.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP50 (10 R-Coins)",
        "productCode" : "RCOIN50",
        "description" : "10 R-Coins",
        "price" : "Php 50.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP80 (16 R-Coins)",
        "productCode" : "RCOIN80",
        "description" : "16 R-Coins",
        "price" : "Php 80.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP105 (21 R-Coins)",
        "productCode" : "RCOIN105",
        "description" : "21 R-Coins",
        "price" : "Php 105.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP315 (63 + 3 R-Coins)",
        "productCode" : "RCOIN315",
        "description" : "63 + 3 R-Coins",
        "price" : "Php 315.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP370 (74 + 4 R-Coins)   ",
        "productCode" : "RCOIN370",
        "description" : "74 + 4 R-Coins",
        "price" : "Php 370.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP525 (105 + 6 R-Coins)",
        "productCode" : "RCOIN525",
        "description" : "105 + 6 R-Coins",
        "price" : "Php 525.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP1050 (210 + 16 R-Coins)",
        "productCode" : "RCOIN1050",
        "description" : "210 + 16 R-Coins",
        "price" : "Php 1050.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "R-COIN PHP2100 (420 + 40 R-Coins)",
        "productCode" : "RCOIN2100",
        "description" : "420 + 40 R-Coins",
        "price" : "Php 2100.00",
        "network" : "RAN",
        "category" : "",
        "image" : "<img src='/static/img/ran_logo.png'>"
    },
    {
        "eLoad" : "Triplejack 300 (Equivalent to 8,220 Jacks)",
        "productCode" : "JACKS300",
        "description" : "8,220 Jacks",
        "price" : "Php 300.00",
        "network" : "Triplejack",
        "category" : "",
        "image" : "<img src='/static/img/triplejack_logo.png'>"
    },
    {
        "eLoad" : "Triplejack 1500 (Equivalent to 41,095 Jacks)",
        "productCode" : "JACKS1500",
        "description" : "41,095 Jacks",
        "price" : "Php 1500.00",
        "network" : "Triplejack",
        "category" : "",
        "image" : "<img src='/static/img/triplejack_logo.png'>"
    },
    {
        "eLoad" : "Triplejack 2750 (Equivalent to 75,340 Jacks)",
        "productCode" : "JACKS2750",
        "description" : "75,340 Jacks",
        "price" : "Php 2750.00",
        "network" : "Triplejack",
        "category" : "",
        "image" : "<img src='/static/img/triplejack_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 50 (equivalent to 30 Points)",
        "productCode" : "OMG50",
        "description" : "30 Points",
        "price" : "Php 50.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 100 (equivalent to 60 Points)",
        "productCode" : "OMG100",
        "description" : "60 Points",
        "price" : "Php 100.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 250 (equivalent to 160 Points)",
        "productCode" : "OMG250",
        "description" : "160 Points",
        "price" : "Php 250.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 500 (equivalent to 320 Points)",
        "productCode" : "OMG500",
        "description" : "320 Points",
        "price" : "Php 500.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 750 (equivalent to 480 Points)",
        "productCode" : "OMG750",
        "description" : "480 Points",
        "price" : "Php 750.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 1000 (equivalent to 640 Points)",
        "productCode" : "OMG1000",
        "description" : "640 Points",
        "price" : "Php 1000.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 1250 (equivalent to 800 Points)",
        "productCode" : "OMG1250",
        "description" : "800 Points",
        "price" : "Php 1250.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 2500 (equivalent to 1600 Points)",
        "productCode" : "OMG2500",
        "description" : "1600 Points",
        "price" : "Php 2500.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 5000 (equivalent to 3200 Points)",
        "productCode" : "OMG5000",
        "description" : "3200 Points",
        "price" : "Php 5000.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 7500 (equivalent to 4800 Points)",
        "productCode" : "OMG7500",
        "description" : "4800 Points",
        "price" : "Php 7500.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 10000 (equivalent to 6400 Points)",
        "productCode" : "OMG10000",
        "description" : "6400 Points",
        "price" : "Php 10000.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "PlayOMG 15000 (equivalent to 9600 Points)",
        "productCode" : "OMG15000",
        "description" : "9600 Points",
        "price" : "Php 15000.00",
        "network" : "PlayOMG",
        "category" : "",
        "image" : "<img src='/static/img/playomg_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 20 (for all LevelUp games)",
        "productCode" : "LVLUP20",
        "description" : "20 eGAMES ePOINTS",
        "price" : "Php 20.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 50 (for all LevelUp games)",
        "productCode" : "LVLUP50",
        "description" : "50 eGAMES ePOINTS",
        "price" : "Php 50.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 75 (for all LevelUp games)",
        "productCode" : "LVLUP75",
        "description" : "75 eGAMES ePOINTS",
        "price" : "Php 75.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 100 (for all LevelUp games)",
        "productCode" : "LVLUP100",
        "description" : "100 eGAMES ePOINTS",
        "price" : "Php 100.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 300 (for all LevelUp games)",
        "productCode" : "LVLUP300",
        "description" : "300 eGAMES ePOINTS",
        "price" : "Php 300.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 350 (for all LevelUp games)",
        "productCode" : "LVLUP350",
        "description" : "350 eGAMES ePOINTS",
        "price" : "Php 350.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 500 (for all LevelUp games)",
        "productCode" : "LVLUP500",
        "description" : "500 eGAMES ePOINTS",
        "price" : "Php 500.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 1000 (for all LevelUp games)",
        "productCode" : "LVLUP1000",
        "description" : "1000 eGAMES ePOINTS",
        "price" : "Php 1000.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "LevelUp 2000 (for all LevelUp games)",
        "productCode" : "LVLUP2000",
        "description" : "2000 eGAMES ePOINTS",
        "price" : "Php 2000.00",
        "network" : "LevelUp",
        "category" : "",
        "image" : "<img src='/static/img/levelup_logo.png'>"
    },
    {
        "eLoad" : "Game Club 20 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC20",
        "description" : "20 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 20.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 50 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC50",
        "description" : "50 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 50.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 100 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC100",
        "description" : "100 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 100.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 200 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC200",
        "description" : "200 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 200.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 300 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC300",
        "description" : "300 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 300.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 400 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC400",
        "description" : "400 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 400.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 500 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC500",
        "description" : "500 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 500.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Game Club 1000 (for CF,WOW,iDate,Dragona)",
        "productCode" : "GC1000",
        "description" : "1000 eCoins (for CF,WOW,iDate,Dragona)",
        "price" : "Php 1000.00",
        "network" : "GameClub",
        "category" : "",
        "image" : "<img src='/static/img/gameclub_logo.png'>"
    },
    {
        "eLoad" : "Softnyx 50 (for Gun Bound, Rakion, Wolf Team)",
        "productCode" : "SOFTNYX50",
        "description" : "1000 Softnyx Cash (for Gun Bound, Rakion, Wolf Team)",
        "price" : "Php 50.00",
        "network" : "Softnyx",
        "category" : "",
        "image" : "<img src='/static/img/softnyx_logo.png'>"
    },
    {
        "eLoad" : "Softnyx 100 (for Gun Bound, Rakion, Wolf Team)",
        "productCode" : "SOFTNYX100",
        "description" : "2000 Softnyx Cash (for Gun Bound, Rakion, Wolf Team)",
        "price" : "Php 100.00",
        "network" : "Softnyx",
        "category" : "",
        "image" : "<img src='/static/img/softnyx_logo.png'>"
    },
    {
        "eLoad" : "Softnyx 300 (for Gun Bound, Rakion, Wolf Team)",
        "productCode" : "SOFTNYX300",
        "description" : "6000 Softnyx Cash (for Gun Bound, Rakion, Wolf Team)",
        "price" : "Php 300.00",
        "network" : "Softnyx",
        "category" : "",
        "image" : "<img src='/static/img/softnyx_logo.png'>"
    },
    {
        "eLoad" : "Softnyx 500 (for Gun Bound, Rakion, Wolf Team)",
        "productCode" : "SOFTNYX500",
        "description" : "10000 Softnyx Cash (for Gun Bound, Rakion, Wolf Team)",
        "price" : "Php 500.00",
        "network" : "Softnyx",
        "category" : "",
        "image" : "<img src='/static/img/softnyx_logo.png'>"
    },
    {
        "eLoad" : "GAMEYEZ 100 (equivalent to 200 Points)",
        "productCode" : "GEP100",
        "description" : "200 Points",
        "price" : "Php 100.00",
        "network" : "GAMEYEZ",
        "category" : "",
        "image" : "<img src='/static/img/gameyez_logo.png'>"
    },
    {
        "eLoad" : "GAMEYEZ 500 (equivalent to 600 Points)",
        "productCode" : "GEP300",
        "description" : "600 Points",
        "price" : "Php 300.00",
        "network" : "GAMEYEZ",
        "category" : "",
        "image" : "<img src='/static/img/gameyez_logo.png'>"
    },
    {
        "eLoad" : "GAMEYEZ 300 (equivalent to 1000 Points)",
        "productCode" : "GEP500",
        "description" : "1,000 Points",
        "price" : "Php 1000.00",
        "network" : "GAMEYEZ",
        "category" : "",
        "image" : "<img src='/static/img/gameyez_logo.png'>"
    },
    {
        "eLoad" : "XiXi Games 300 (equivalent to 200 XiXi Coins)",
        "productCode" : "XiXi300",
        "description" : "500 XiXi Coins",
        "price" : "Php 300.00",
        "network" : "XiXiGames",
        "category" : "",
        "image" : "<img src='/static/img/xixigames_logo.png'>"
    },
    {
        "eLoad" : "XiXi Games 750 (equivalent to 500 XiXi Coins)",
        "productCode" : "XiXi750",
        "description" : "200 XiXi Coins",
        "price" : "Php 750.00",
        "network" : "XiXiGames",
        "category" : "",
        "image" : "<img src='/static/img/xixigames_logo.png'>"
    },
    {
        "eLoad" : "XiXi Games 1500 (equivalent to 1000 XiXi Coins)",
        "productCode" : "XiXi1500",
        "description" : "1000 XiXi Coins",
        "price" : "Php 1500.00",
        "network" : "XiXiGames",
        "category" : "",
        "image" : "<img src='/static/img/xixigames_logo.png'>"
    },
    {
        "eLoad" : "XiXi Games 7500 (equivalent to 5000 XiXi Coins)",
        "productCode" : "XiXi7500",
        "description" : "5000 XiXi Coins",
        "price" : "Php 7500.00",
        "network" : "XiXiGames",
        "category" : "",
        "image" : "<img src='/static/img/xixigames_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 88 (equivalent to 60 V-Cash)",
        "productCode" : "VOOMGA88",
        "description" : "60 V-Cash",
        "price" : "Php 88.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 220 (equivalent to 150 V-Cash)",
        "productCode" : "VOOMGA220",
        "description" : "150 V-Cash",
        "price" : "Php 220.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 440 (equivalent to 300 V-Cash)",
        "productCode" : "VOOMGA440",
        "description" : "300 V-Cash",
        "price" : "Php 440.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 880 (equivalent to 600 V-Cash)",
        "productCode" : "VOOMGA880",
        "description" : "600 V-Cash",
        "price" : "Php 880.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 2150 (equivalent to 1500 V-Cash)",
        "productCode" : "VOOMGA2150",
        "description" : "1500 V-Cash",
        "price" : "Php 2150.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "VOOMGA 4300 (equivalent to 3000 V-Cash)",
        "productCode" : "VOOMGA4300",
        "description" : "3000 V-Cash",
        "price" : "Php 4300.00",
        "network" : "VOOMGA",
        "category" : "",
        "image" : "<img src='/static/img/voomga_logo.png'>"
    },
    {
        "eLoad" : "SNSPLUS 20 (Soul of Summoners)",
        "productCode" : "SNSPLUS20",
        "description" : "20 SNS+ Game Coins",
        "price" : "Php 20.00",
        "network" : "SNS",
        "category" : "",
        "image" : "<img src='/static/img/sns_logo.png'>"
    },
    {
        "eLoad" : "SNSPLUS 100 (Soul of Summoners)",
        "productCode" : "SNSPLUS100",
        "description" : "100 SNS+ Game Coins",
        "price" : "Php 100.00",
        "network" : "SNS",
        "category" : "",
        "image" : "<img src='/static/img/sns_logo.png'>"
    },
    {
        "eLoad" : "SNSPLUS 300 (Soul of Summoners)",
        "productCode" : "SNSPLUS300",
        "description" : "300 SNS+ Game Coins",
        "price" : "Php 300.00",
        "network" : "SNS",
        "category" : "",
        "image" : "<img src='/static/img/sns_logo.png'>"
    },
    {
        "eLoad" : "SNSPLUS 500 (Soul of Summoners)",
        "productCode" : "SNSPLUS500",
        "description" : "500 SNS+ Game Coins",
        "price" : "Php 500.00",
        "network" : "SNS",
        "category" : "",
        "image" : "<img src='/static/img/sns_logo.png'>"
    },
    {
        "eLoad" : "SNSPLUS 1000 (Soul of Summoners)",
        "productCode" : "SNSPLUS1000",
        "description" : "1000 SNS+ Game Coins",
        "price" : "Php 1000.00",
        "network" : "SNS",
        "category" : "",
        "image" : "<img src='/static/img/sns_logo.png'>"
    },
    {
        "eLoad" : "Hold'em PH 20 (200K Chips/4 Gold Coins)",
        "productCode" : "HOLDEM20",
        "description" : "200K Chips/4 Gold Coins",
        "price" : "Php 20.00",
        "network" : "Holdem",
        "category" : "",
        "image" : "<img src='/static/img/holdem_logo.png'>"
    },
    {
        "eLoad" : "Hold'em PH 40 (450K Chips/9 Gold Coins)",
        "productCode" : "HOLDEM40",
        "description" : "450K Chips/9 Gold Coins",
        "price" : "Php 40.00",
        "network" : "Holdem",
        "category" : "",
        "image" : "<img src='/static/img/holdem_logo.png'>"
    },
    {
        "eLoad" : "Hold'em PH 70 (1M Chips/19 Gold Coins)",
        "productCode" : "HOLDEM70",
        "description" : "1M Chips/19 Gold Coins",
        "price" : "Php 70.00",
        "network" : "Holdem",
        "category" : "",
        "image" : "<img src='/static/img/holdem_logo.png'>"
    },
    {
        "eLoad" : "Hold'em PH 140 (2M Chips/40 Gold Coins)",
        "productCode" : "HOLDEM140",
        "description" : "2M Chips/40 Gold Coins",
        "price" : "Php 140.00",
        "network" : "Holdem",
        "category" : "",
        "image" : "<img src='/static/img/holdem_logo.png'>"
    },
    {
        "eLoad" : "Hold'em PH 360 (6M Chips/115 Gold Coins)",
        "productCode" : "HOLDEM360",
        "description" : "6M Chips/115 Gold Coins",
        "price" : "Php 360.00",
        "network" : "Holdem",
        "category" : "",
        "image" : "<img src='/static/img/holdem_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 220 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP220",
        "description" : "WP220 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "price" : "Php 220.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 440 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP440",
        "description" : "$10/1000 Points (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "price" : "Php 440.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 660 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP660",
        "description" : "$15/1,500 Points (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "price" : "Php 660.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 880 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP880",
        "description" : "$20/2,000 Points (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "price" : "Php 880.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 1320 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP1320",
        "description" : "$30/3,000 Points (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "price" : "Php 1320.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "WarpPortal 2200 (RO1,RO2,Requiem,Rose,Dragon Saga)",
        "productCode" : "WP2200",
        "description" : "$50/5,000 Points",
        "price" : "Php 2200.00",
        "network" : "Warpportal",
        "category" : "",
        "image" : "<img src='/static/img/warpportal_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 20 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE20",
        "description" : "for KUF2, War Rock and Andarasa",
        "price" : "Php 20.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 50 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE50",
        "description" : "for KUF2, War Rock and Andarasa",
        "price" : "Php 50.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 100 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE100",
        "description" : "for KUF2, War Rock and Andarasa",
        "price" : "Php 100.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 300 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE300",
        "description" : "for KUF2, War Rock and Andarasa",
        "price" : "Php 300.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 500 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE500",
        "description" : "for KUF2, War Rock and Andarasa",
        "price" : "Php 500.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "Lead Hope 1000 (for KUF2, War Rock & Andarasa)",
        "productCode" : "LEADHOPE1000",
        "description" : "or KUF2, War Rock and Andarasa",
        "price" : "Php 1000.00",
        "network" : "LeadHope",
        "category" : "",
        "image" : "<img src='/static/img/leadhope_logo.png'>"
    },
    {
        "eLoad" : "SWEEPO 100 (equivalent to 5 days AutoPlay)",
        "productCode" : "SWEEPO100",
        "description" : "AutoPlay",
        "price" : "Php 100.00",
        "network" : "Sweepo",
        "category" : "",
        "image" : "<img src='/static/img/sweepo_logo.png'>"
    },
    {
        "eLoad" : "SWEEPO 500 (equivalent to 30 days AutoPlay)",
        "productCode" : "SWEEPO500",
        "description" : "AutoPlay",
        "price" : "Php 500.00",
        "network" : "Sweepo",
        "category" : "",
        "image" : "<img src='/static/img/sweepo_logo.png'>"
    },
    {
        "eLoad" : "SWEEPO 1000 (equivalent to 75 days AutoPlay)",
        "productCode" : "SWEEPO1000",
        "description" : "AutoPlay",
        "price" : "Php 1000.00",
        "network" : "Sweepo",
        "category" : "",
        "image" : "<img src='/static/img/sweepo_logo.png'>"
    },
    {
        "eLoad" : "Tongits Wars 25 (50 Gold)",
        "productCode" : "TWGOLD25",
        "description" : "50 Gold",
        "price" : "Php 25.00",
        "network" : "Tongits",
        "category" : "",
        "image" : "<img src='/static/img/tongits_logo.png'>"
    },
    {
        "eLoad" : "Tongits Wars 50 (150 Gold)",
        "productCode" : "TWGOLD50",
        "description" : "150 Gold",
        "price" : "Php 50.00",
        "network" : "Tongits",
        "category" : "",
        "image" : "<img src='/static/img/tongits_logo.png'>"
    },
    {
        "eLoad" : "Tongits Wars 60 (250 Gold)",
        "productCode" : "TWGOLD60",
        "description" : "250 Gold",
        "price" : "Php 60.00",
        "network" : "Tongits",
        "category" : "",
        "image" : "<img src='/static/img/tongits_logo.png'>"
    },
    {
        "eLoad" : "Tongits Wars 100 (500 Gold)  ",
        "productCode" : "TWGOLD100",
        "description" : "500 Gold",
        "price" : "Php 100.00",
        "network" : "Tongits",
        "category" : "",
        "image" : "<img src='/static/img/tongits_logo.png'>"
    },
    {
        "eLoad" : "Tongits Wars 200 (1250 Gold)",
        "productCode" : "TWGOLD200",
        "description" : "1250 Gold",
        "price" : "Php 200.00",
        "network" : "Tongits",
        "category" : "",
        "image" : "<img src='/static/img/tongits_logo.png'>"
    },
    {
        "eLoad" : "uCoins P49 - 60K uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS49",
        "description" : "60K uCoins (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 49.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "uCoins P249 - 330K uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS249",
        "description" : "330K uCoins (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 249.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "uCoins P499 - 1.35M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS499",
        "description" : "1.35M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 499.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "uCoins P999 - 3M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS999",
        "description" : "3M uCoin (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 999.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "uCoins P1,999 - 12M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS1999",
        "description" : "12M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 1999.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "uCoins P4,999 - 36M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "productCode" : "UCOINS4999",
        "description" : "36M uCoins (Social & Ultimate Tongits, Lucky 8)",
        "price" : "Php 4999.00",
        "network" : "uCoin",
        "category" : "",
        "image" : "<img src='/static/img/ucoin_logo.png'>"
    },
    {
        "eLoad" : "Marino PhonePal 300",
        "productCode" : "Marino300",
        "description" : "Maritime voice call service valid for 75days",
        "price" : "Php 300.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "Marino PhonePal 500",
        "productCode" : "Marino500",
        "description" : "Maritime voice call service valid for 120days",
        "price" : "Php 500.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "Marino Textmate 100",
        "productCode" : "MarinoTxt100",
        "description" : "Texts to Philippines",
        "price" : "Php 100.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "Marino All Abroad 300 (valid for 75 days)",
        "productCode" : "MarinoAA300",
        "description" : "valid for 75 days",
        "price" : "Php 300.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "Marino All Abroad 500 (valid for 120 days)",
        "productCode" : "MarinoAA500",
        "description" : "valid for 120 days",
        "price" : "Php 500.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "Marino All Abroad 1000 (valid for 120 days)",
        "productCode" : "MarinoAA1000",
        "description" : "valid for 120 days",
        "price" : "Php 1000.00",
        "network" : "Marino",
        "category" : "",
        "image" : "<img src='/static/img/marino_logo.png'>"
    },
    {
        "eLoad" : "GSAT200",
        "productCode" : "GSAT200",
        "description" : "30 days of HD Family Package",
        "price" : "Php 200.00",
        "network" : "GSAT",
        "category" : "",
        "image" : "<img src='/static/img/gsat_logo.png'>"
    },
    {
        "eLoad" : "GSAT 300",
        "productCode" : "GSAT300",
        "description" : "BASIC  PACKAGE",
        "price" : "Php 300.00",
        "network" : "GSAT",
        "category" : "",
        "image" : "<img src='/static/img/gsat_logo.png'>"
    },
    {
        "eLoad" : "GSAT 500",
        "productCode" : "GSAT500",
        "description" : "BASIC + ASIAN + HD PACKAGE",
        "price" : "Php 500.00",
        "network" : "GSAT",
        "category" : "",
        "image" : "<img src='/static/img/gsat_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 200",
        "productCode" : "CRC200",
        "description" : "40 SD Channels",
        "price" : "Php 200.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 450",
        "productCode" : "CRC450",
        "description" : "5 HD Channels, 59 SD Channels",
        "price" : "Php 450.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 500",
        "productCode" : "CRC500",
        "description" : "9 HD Channels, 62 SD Channels",
        "price" : "Php 500.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 600",
        "productCode" : "CRC600",
        "description" : "15 HD Channels, 67 SD Channels",
        "price" : "Php 600.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 800",
        "productCode" : "CRC800",
        "description" : "18 HD Channels, 73 SD Channels",
        "price" : "Php 800.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "CIGNAL RELOAD CARD 1000",
        "productCode" : "CRC1000",
        "description" : "21 HD Channels, 80 SD Channels",
        "price" : "Php 1000.00",
        "network" : "Cignal",
        "category" : "",
        "image" : "<img src='/static/img/cignal_logo.png'>"
    },
    {
        "eLoad" : "SkyPrepaid 99 valid for 30 days  ",
        "productCode" : "SKY99",
        "description" : "http://www.mysky.com.ph/skycableprepaid-apply",
        "price" : "Php 99.00",
        "network" : "Sky",
        "category" : "",
        "image" : "<img src='/static/img/sky_logo.png'>"
    },
    {
        "eLoad" : "SkyPrepaid 250 valid for 30 days",
        "productCode" : "SKY250",
        "description" : "SkyPrepaid 250 valid for 30 days   ",
        "price" : "Php 250.00",
        "network" : "Sky",
        "category" : "",
        "image" : "<img src='/static/img/sky_logo.png'>"
    },
    {
        "eLoad" : "SkyPrepaid 450 valid for 30 days",
        "productCode" : "SKY450",
        "description" : "Enjoy 41 SD and 8 HD channels for only P450",
        "price" : "Php 450.00",
        "network" : "Sky",
        "category" : "",
        "image" : "<img src='/static/img/sky_logo.png'>"
    },
    {
        "eLoad" : "WTFAST 4995 (12 Months Subscription Service)",
        "productCode" : "WTFAST4995",
        "description" : "12 Months Subscription Service",
        "price" : "pHP 4995.00",
        "network" : "Wtfast",
        "category" : "",
        "image" : "<img src='/static/img/wtfast_logo.png'>"
    },
    {
        "eLoad" : "WTFAST 2700 (6 Months Subscription Service)",
        "productCode" : "WTFAST2700",
        "description" : "6 Months Subscription Service",
        "price" : "Php 2700.00",
        "network" : "Wtfast",
        "category" : "",
        "image" : "<img src='/static/img/wtfast_logo.png'>"
    },
    {
        "eLoad" : "WTFAST 1425 (3 Months Subscription Service)",
        "productCode" : "WTFAST1425",
        "description" : "3 Months Subscription Service",
        "price" : "Php 1425.00",
        "network" : "Wtfast",
        "category" : "",
        "image" : "<img src='/static/img/wtfast_logo.png'>"
    },
    {
        "eLoad" : "WTFAST 500 (1 Month Subscription Service)",
        "productCode" : "WTFAST500",
        "description" : "1 Month Subscription Service",
        "price" : "Php 500.00",
        "network" : "Wtfast",
        "category" : "",
        "image" : "<img src='/static/img/wtfast_logo.png'>"
    },
    {
        "eLoad" : "VIU P30.00 (PROMO 30 Days Subscription)",
        "productCode" : "VIU30",
        "description" : "PROMO| 1 month subscription | Original Price - P99",
        "price" : "Php 30.00",
        "network" : "VIU",
        "category" : "",
        "image" : "<img src='/static/img/viu_logo.png'>"
    },
    {
        "eLoad" : "ESET 250 (1 yr Mobile Security v3)",
        "productCode" : "ESET250",
        "description" : "yr Mobile Security v3",
        "price" : "Php 250.00",
        "network" : "ESET",
        "category" : "",
        "image" : "<img src='/static/img/eset_logo.png'>"
    },
    {
        "eLoad" : "ESET 650 (1 yr PC NOD32 Anti Virus)",
        "productCode" : "ESET650",
        "description" : "PC NOD32 Anti Virus",
        "price" : "Php 650.00",
        "network" : "ESET",
        "category" : "",
        "image" : "<img src='/static/img/eset_logo.png'>"
    },
    {
        "eLoad" : "ESET 850 (1 yr Internet Security)",
        "productCode" : "ESET850",
        "description" : "PC Smart Security",
        "price" : "Php 850.00",
        "network" : "ESET",
        "category" : "",
        "image" : "<img src='/static/img/eset_logo.png'>"
    },
    {
        "eLoad" : "ESET CS 850 (1-yr Cyber Security Pro for Mac)",
        "productCode" : "ESETCS850",
        "description" : "Cyber Security Pro for Mac",
        "price" : "Php 850.00",
        "network" : "ESET",
        "category" : "",
        "image" : "<img src='img/eset_logo.png'>"
    }
]