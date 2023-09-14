$(document).ready(function() {
    var selectedSeason;   // 계절
    var selectedWeather;  // 날씨
    var selectedMeal;      // 시간
    var selectedMood;     // 기분
    var selectedAllergies = [];   // 알레르기
    var selectedFood;     // 선택한 음식
    var selectedFoodReason; // 선택한 음식의 이유
    var imgSrc;
    var titles = {
        'ranking': "<b>오늘의 랭킹</b>",
        'season': "현재 <b>계절</b>은?",
        'weather': "현재 <b>날씨</b>는?",
        'meal': "현재 <b>시간</b>은?",
        'mood': "오늘 <b>기분</b>은?",
        'allergy': "가지고 있는 <b>알러지</b>는?",
        'result-food': "<b>이거한번잡숴봐</b>",
        'share': "<b>오늘은 이거다~!</b>"
    }
    var emoji_url = '/static/img/'

    // var apiUrl = 'http://ec2-43-201-104-168.ap-northeast-2.compute.amazonaws.com';
    var apiUrl = 'http://foodiedrop.site';

    Kakao.init('961a1b0f0a361e8a5f9794c0ed14f924');
    $.getScript("https://connect.facebook.net/en_US/sdk.js", function() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '960196475269601', // 앱 ID를 설정합니다.
                cookie     : true,
                xfbml      : true,
                version    : 'v17.0' // Facebook API 버전을 설정합니다.
            });
        };
    });

    function getFoodRecommendation() {
        $(".info-p").hide();
        // API 서버 엔드포인트
        let api = apiUrl + '/food';
        let api_emoji = emoji_url + '/food/'
        // 알러지 정보를 받습니다.
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedAllergies.push(checkbox.value);
            }
        });

        // 요청할 데이터
        var requestData = {
            "season": selectedSeason,
            "weather": selectedWeather,
            "time": selectedMeal,
            "mood": selectedMood,
            "allergies": selectedAllergies
        };

        // AJAX를 사용하여 API 서버에 POST 요청을 보냅니다.
        $.ajax({
            type: 'POST',
            url: api,
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                // 응답 성공 시 결과를 화면에 표시합니다.

                // 결과를 가공하여 표시할 HTML 코드 생성
                var resultHTML = '';
                for (var key in response) {
                    var food = response[key];
                    resultHTML += '<div class="result-food-content">';
                    resultHTML += '<a href="#" class="food-link" data-food-name="' + food.name + '">';
                    resultHTML += '<div class="result-image-container">';
                    resultHTML += '<img src="' + api_emoji + food.emoji + '" alt="' + food.name + '">'
                    // resultHTML += '</a>'
                    resultHTML += '</div>';
                    resultHTML += '<div class="result-text-container">'
                    // resultHTML += '<a href="#" class="food-link" data-food-name="' + food.name + '">';
                    resultHTML += '<h2 class="' + food.name + '">' + food.name + '</h2>';
                    resultHTML += '<p>' + food.reason + '</p>';
                    resultHTML += '</a>';
                    resultHTML += '</div>';
                    resultHTML += '</div>';
                }

                $("#result-food").html(resultHTML); // 결과를 #result-food에 표시합니다.
                $(".result-btn-container").show();
                $(".info-p").html("가장 먹고 싶은 메뉴를 선택해 주세요!")
                $(".info-p").show();
            },
            error: function() {
                // 응답 실패 시 에러 메시지를 표시합니다.
                let demoHTML = '<div class="result-food-content"><div class="result-image-container"><img src="https://em-content.zobj.net/thumbs/240/apple/354/hamburger_1f354.png" alt="" /></div><div class="result-text-container"><a href="#" class="food-link" data-food-name="햄버거"><h2>햄버거</h2><p>햄버거는 맛있습니다. 제가 좋아하는 햄버거 브랜드는 버거킹이빈다.</p></a></div></div><div class="result-food-content"><div class="result-image-container"><img src="https://em-content.zobj.net/thumbs/240/apple/354/hamburger_1f354.png" alt="" /></div><div class="result-text-container"><a href="#" class="food-link" data-food-name="햄버거"><h2>햄버거</h2><p>햄버거는 맛있습니다. 제가 좋아하는 햄버거 브랜드는 버거킹이빈다.</p></a></div></div><div class="result-food-content"><div class="result-image-container"><img src="https://em-content.zobj.net/thumbs/240/apple/354/hamburger_1f354.png" alt="" /></div><div class="result-text-container"><a href="#" class="food-link" data-food-name="햄버거"><h2>햄버거</h2><p>햄버거는 맛있습니다. 제가 좋아하는 햄버거 브랜드는 버거킹이빈다.</p></a></div></div>\n';
                $("#result-food").html("<p>음식 추천을 가져오지 못했습니다. 대신에 데모 코드를 보여드리죠.</p>" + demoHTML);
                $(".result-btn-container").show();
            }
        });
    }

    /* 랭킹 */
    function getRanking() {
        var api = apiUrl + '/ranking';

        // AJAX를 사용하여 API 서버에 GET 요청을 보냅니다.
        $.ajax({
            type: 'GET',
            url: api,
            contentType: 'application/json',
            timeout: 10000,
            success: function(response) {
                if (response.length == 0){
                    $("#rank-food").html("데이터가 없습니다!");
                } else {
                    // 응답 성공 시 결과를 화면에 표시합니다.

                    // 결과는 ["햄버거","피자","햇반"] 형태로 전달됩니다.
                    // 결과를 가공하여 표시할 HTML 코드 생성
                    var resultHTML = '';
                    for (var i = 0; i < response.length; i++) {
                        var food = response[i];
                        resultHTML += '<div class="rank-content">';
                        resultHTML += '<img class="rank-img" src="' + emoji_url + '/medal/' + (i + 1) +'.png">';
                        resultHTML += '<div class="rank-text-container">'
                        resultHTML += '<span>' + food + '</span>';
                        resultHTML += '</div>';
                        resultHTML += '</div>';
                    }

                    $("#rank-food").html(resultHTML); // 결과를 #rank-food에 표시합니다.
                }
            },
            error: function (){
                let demoHTML = '<div class="rank-content"><img class="rank-img" src="/static/img/medal/1.png"><div class="rank-text-container"><span>맛있는 바비큐</span></div></div><div class="rank-content"><img class="rank-img" src="/static/img/medal/2.png"><div class="rank-text-container"><span>아침밥</span></div></div><div class="rank-content"><img class="rank-img" src="/static/img/medal/3.png"><div class="rank-text-container"><span>단호박</span></div></div>';
                $("#rank-food").html('<span>와! 서버 통신간 오류가 발생했어요. 데모 코드를 보여드릴게요.</span>' + demoHTML);
            }
        });
    }

    // 결과 저장
    function saveResult() {
        var api = apiUrl + '/data';

        // 요청할 데이터
        const saveData = {
            "season": selectedSeason,
            "weather": selectedWeather,
            "mealtime": selectedMeal,
            "mood": selectedMood,
            "allergies": selectedAllergies,
            "result_food": selectedFood,
        };

        // AJAX를 사용하여 API 서버에 POST 요청을 보냅니다.
        $.ajax({
            type: 'POST',
            url: api,
            contentType: 'application/json',
            data: JSON.stringify(saveData),
            success: function(response) {
                // 응답 성공 시 결과를 화면에 표시합니다.
            },
            error: function() {
                // 응답 실패 시 에러 메시지를 표시합니다.
            }
        });
    }

    // 시작 > 계절
    $(".start").click(function() {
        $(".main").hide();
        $(".rank-box").hide();
        $(".title-text").html(titles['season']);

        $(".selections").show();
        $(".season-selection").show();
    });
  
    // 계절 > 날씨
    $(".season-btn").click(function() {
        selectedSeason = $(this).attr("id");
        $(".season-selection").hide();
        $(".title-text").html(titles['weather']);
        $(".weather-selection").show();
    });
  
    // 날씨 > 시간
    $(".weather-btn").click(function() {
        selectedWeather = $(this).attr("id");
        $(".weather-selection").hide();
        $(".title-text").html(titles['meal']);
        $(".meals-selection").show();
    });
  
    // 시간 > 기분
    $(".meals-btn").click(function() {
        selectedMeal = $(this).attr("id");
        $(".meals-selection").hide();
        $(".title-text").html(titles['mood']);
        $(".mood-selection").show();
    });
  
    // 기분 > 알레르기
    $(".mood-btn").click(function() {
        selectedMood = $(this).attr("id");
        $(".mood-selection").hide();
        $(".title-text").html(titles['allergy']);
        $(".allergy-selection").show();
    });
  
    // 알레르기 정보 입력 버튼 클릭 시 -> 결과 표출
    $(".allergy-btn").click(function() {
        $('.title-text').css('font-family', "'MapleBold', 'serif'");
        $(".allergy-selection").hide();
        $(".result-btn-container").hide();
        
        // API 서버와 통신하여 음식 추천 결과를 받아옵니다.
        getFoodRecommendation();

        $(".title-text").html(titles['result-food']);

        $(".result").show();
        var resultText = '<img class="loading-img" src="/static/img/loading.gif" alt="추천 중" />';

        $("#result-food").html(resultText);
    });

    // 다시 시도하기
    $(".retry").click(function (){
        $(".result-btn-container").hide();
        $("#result-food").html('<img class="loading-img" src="/static/img/loading.gif" alt="추천 중" />');
        getFoodRecommendation();
    })

    // 결과 > 음식 선택
    $(document).on("click", ".food-link", function() {
        $('.title-text').css('font-family', "'MapleLight', 'serif'");
        // selectedFood = $(this).text();
        selectedFood = $(this).find("h2").text();
        selectedFoodReason = $(this).find("p").text();
        imgSrc = $(this).find("img").attr("src");

        if (!selectedFood) {
            selectedFood = $(this).closest(".result-food-content").find("h2").text();
        }
        if (!selectedFoodReason) {
            selectedFoodReason = $(this).closest(".result-food-content").find("p").text();
        }
        if (!imgSrc) {
            imgSrc = $(this).closest(".result-food-content").find("img").attr("src");
        }


        let resultHTML = '';
        resultHTML += '<div class="selected-food-img-container">';
        resultHTML += '<img src="' + imgSrc + '" alt=' + selectedFood + ' />';
        resultHTML += '</div>';
        resultHTML += '<div class="selected-food-text-container">';
        resultHTML += '<h2>' + selectedFood + '</h2>'
        resultHTML += '<span>' + selectedFoodReason + '</span>'
        resultHTML += '</div>'

        $(".info-p").hide();
        $(".result").hide();
        $(".title-text").html(titles['share']);
        $(".selected-food").show();
        $(".selected-food-container").html(resultHTML);

        saveResult();
    });

    // 결과 > 메인으로
    $(".go-main").click(function() {
        $('.title-text').css('font-family', "'MapleLight', 'serif'");
        $(".info-p").hide();
        $(".result").hide();
        $(".rank-box").hide();
        $(".selected-food").hide();
        $(".selections").hide();

        // 변수 초기화
        selectedSeason = null;
        selectedWeather = null;
        selectedMeal = null;
        selectedMood = null;
        selectedFood = null;

        $(".main").show();
    });

    // 메인, 결과 > 랭킹보기
    $(".see-rank").click(function() {
        getRanking();

        $(".main").hide();
        $(".info-p").hide();
        $(".result").hide();
        $(".selected-food").hide();

        $(".selections").show();

        $(".title-text").html(titles['ranking']);
        $(".rank-box").show();
    });

    // 카톡 공유하기
    $("#btn-kakaotalk").click(function() {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: selectedFood,
            description: selectedFoodReason,
            imageUrl: 'http://foodiedrop.site'+ imgSrc,
            link: {
              mobileWebUrl: 'http://foodiedrop.site',
              webUrl: 'http://foodiedrop.site',
            },
          },
          buttons: [
            {
              title: '나도 추천받기',
              link: {
                mobileWebUrl: 'http://foodiedrop.site',
                webUrl: 'http://foodiedrop.site',
              },
            },
          ],
        });
    });
    // 페이스북 공유하기
    $("#btn-facebook").click(function() {
      FB.ui({
        display: 'popup',
        method: 'share',
        href: 'http://foodiedrop.site',
        hashtag: '#이거한번잡숴봐',
      }, function(response){});
    });
    // 트위터 공유하기
    $("#btn-twitter").click(function() {
        var sendText = "[추천 결과: " + selectedFood + "] " + selectedFoodReason; // 전달할 텍스트
        var sendUrl = "http://foodiedrop.site"; // 전달할 URL
        window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
    });
  });