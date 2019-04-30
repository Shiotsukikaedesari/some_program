/**
 * Created by Administrator on 4/30/2019.
 */

/**
 *
 * @param name : 名字
 * @param number : 随机分号
 * @param id : 全局id定位
 * @returns {string}
 */
let nameListBox = function(name, number, id){
    return `<div class="name-list-box" data-id="${id}">
                    <div class="name-list-box-name" >${name}</div>
                    <div class="name-list-box-code">${number}</div>
                </div>`;
};

/**
 * 随机分号分组全局函数
 */
let layout = function(){
    let $groupOne = $('.group-one'); //一组
    let $groupTwo = $('.group-two'); //二组


    if(personList[0]){
        //先排号在加载
        let max = personList.length;
        let tempList = [];//临时素组记录录用的随机数
        while(true){
            let random = Math.floor(Math.random() * max);
            let jump = 0; //是否跳过该次循环开关
            tempList.forEach((elem, i, arr) => {
                if(random === elem){
                    jump = 1;
                }
            });
            if(jump){
                continue;
            }
            personList[tempList.length].number = random + 1;
            tempList.push(random);
            if(personList.length === tempList.length){
                break;
            }
        }
        let $nameList = $('.name-list');
        let html = ``;
        personList.forEach((elem, i, arr) => {
            html += nameListBox(elem.name, elem.number + '号', elem.id);
        });
        $nameList.html(html);

        ////////////////分组/////////////////////////////
        group1 = [];
        group2 = [];
        let half = Math.floor(personList.length/2);
        let groupHtml1 = '';
        let groupHtml2 = '';
        personList.forEach((elem, i, arr) => {
            if(elem.number <= half){
                groupHtml1 += nameListBox(elem.name, elem.number + '号', elem.id);
                group1.push(elem);
            }else{
                groupHtml2 += nameListBox(elem.name, elem.number + '号', elem.id);
                group2.push(elem);
            }
            $groupOne.html(groupHtml1);
            $groupTwo.html(groupHtml2);
        });
    }else{
        let groupHtml1 = '';
        let groupHtml2 = '';
        $groupOne.html(groupHtml1);
        $groupTwo.html(groupHtml2);
    }

};

/**
 * 加载场次函数
 * @param times 传入添加分组次数
 */
let competition = function(times){
    let $group = $('.group');
    let groupTable = $('<div class="group-table"><div>');
    let groupHeader = `<div class="group-time">
                <div class="times">场次：<span>${times}</span></div>
                <div class="time">统计时间：<span>${(new Date()).toLocaleString()}</span></div>
            </div>`;

    ///表格内容拼接
    let tableElment = ``;
    group1.forEach((elem, i, arr) => {
        if(i === group1.length - 1){
            tableElment += `<tr>
                    <td style="border-bottom: 1px solid black;">${elem.name}</td>
                    <td style="border-bottom: 1px solid black;">${elem.number + '号'}</td>
                    <td style="border-bottom: 1px solid black;" ><input type="text" data-id="${elem.id}"></td>
                </tr>`;
        }else{
            tableElment += `<tr>
                    <td>${elem.name}</td>
                    <td>${elem.number + '号'}</td>
                    <td><input type="text" data-id="${elem.id}"></td>
                </tr>`;
        }
    });
    group2.forEach((elem, i, arr) => {
        tableElment += `<tr>
                    <td>${elem.name}</td>
                    <td>${elem.number + '号'}</td>
                    <td><input type="text" data-id="${elem.id}"></td>
                </tr>`;
    });
    ///表格拼接
    let table = ` <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>号码</th>
                    <th>分数</th>
                </tr>
                </thead>

                <tbody>` + tableElment + `</tbody>
            </table>`;
    groupTable.append(groupHeader).append(table);
    $group.append(groupTable);
};




///////////////////////////////////////////////////////////
let personList = [];//全局变量：人员名单id, name, number
let id = 0; //全局id记录参数
let times = 1; //全局记录比赛场次
let group1 = []; //全局第一组
let group2 = []; //全局第二组
/////////////////////////////////////////////////////////////
$(() => {
    let $personAdd = $('.people-add>input[value="添加"]'); //添加按钮
    let $personName = $('.people-add>input[name="person"]');//添加人名
    let $nameList = $('.name-list');//列队

    /////////////////////绑定添加事件/////////////////////////
    $personAdd.click(e => {
        let $tar = $(e.target);
        if($personName.val()){
            $nameList.append(nameListBox($personName.val(), '', id));
            let person = {id: id, name: $personName.val(), number: '', sum: 0};
            personList.push(person);
            $personName.val('');
            id += 1;
        }
    });

    $(window).keyup(e => {
        if(e.keyCode === 13){
            $personAdd.click();
        }
    });

    //////////取消该人信息事件-采用事件代理///////////////////
    $nameList.on('click', '.name-list-box', e => {
        let $tar = $(e.target);
        if($tar.attr('class') === 'name-list-box'){
            let childId = $tar.data('id');
            console.log(childId);
            $tar.remove();
            personList.forEach((elem, i, arr) => {
                if(elem.id === childId){
                    personList.splice(i, 1);
                }
            });
        }else{
            let childId = $tar.parent().data('id');
            personList.forEach((elem, i, arr) => {
                if(elem.id === childId){
                    personList.splice(i, 1);
                }
            });
            $tar.parent().remove();
        }
        layout();

    });



/////////////////////////////////////////////////////////////////
    let $func1 = $('.func>input:first-child'); //随机排号按钮
    let $func2 = $('.func>input:last-child'); //随机分组按钮

    $func1.click(e => {
        let $tar = $(e.target);
        if(!personList[0]){
            alert('请先添加选手！');
            return;
        }

        if(personList.length < 2){
            alert('参赛选手人数不足!');
            return;
        }

        layout();

    });

    $func2.click(e => {
        let $tar = $(e.target);
        if(personList.length < 2){
            alert('请先添加足够的参赛选手');
            return;
        }
        if(!group1[0]){
            alert('请先进行分组');
            return;
        }
        competition(times);
        times += 1;
    });
});

$(() => {
    let $summary = $('.summary-button>input'); //点击按钮
    let $summaryTable = $('.summary>.summary-table'); //战报位置


    $summary.click(e => {
        let summaryElenemt = ``;
        personList.forEach((elem, i, arr) => {
            let $sum = $(`input[data-id=${elem.id}]`);
            let sum = 0;
            for(let i = 0; i < $sum.length; i += 1){
                sum += parseInt($($sum[i]).val());
            }
            elem.sum = sum;//算出总分
        });

        //排序算法
        personList.sort(function (a, b) {
            let value1 = a.sum;
            let value2 = b.sum;
            return  value2 - value1;
        });

        personList.forEach((elem, i, arr) => {
            summaryElenemt += `<tr>
                    <td>${elem.name}</td>
                    <td>${elem.sum}</td>
                </tr>`
        });

        let html = `<table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>总分</th>
                </tr>
                </thead>
                <tbody>` + summaryElenemt + `</tbody>
            </table>`;
        $summaryTable.html(html);
    });
});