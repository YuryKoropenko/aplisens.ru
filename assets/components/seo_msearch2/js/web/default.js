var seo_mse2 = {
    config: {
        rus: "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g)
        ,eng: "shh sh ch cz yu ya yo zh '' y  e' a b v g d e z i j k l m n o p r s t u f x '".split(/ +/g)
        ,url: ''
        ,slash: ''
    }
    ,vars: {}
    ,run: function(){
        var $this = this;
        $.post( this.vars[0]+this.vars[1],{ action: "seo-filter"}).done(function(response){
            try{response = JSON.parse(response);}catch (e){return false;}
            if(response.success){
                $this.setTitle(response.data.pagetitle);
                $this.setData(response.data);
                $this.setContentVisible(response.data);
            }
        }).always(function(response){
            try{
                response = JSON.parse(response);
                if(typeof response.url == "object"){
                    $this.vars = [response.url.resource,response.url.params];
                }
            }catch (e){}
            $this.mSearch2HashSet();
        });
    }
    ,setTitle: function(title){
        if(title && title != ""){
            document.title = title;
        }
    }
    ,setData: function(data){
        if(data){
            for(var i in data){
                $('.js_seo_filter-'+i).html(data[i]);
            }
        }
    }
    ,setContentVisible: function(data){
        if(data.content){
            $('.js_seo_filter-container').show();
            $('.js_seo_filter-content').html(data.content);
        }else{
            $('.js_seo_filter-container').hide();
            $('.js_seo_filter-content').html('');
        }
    }
    ,load_mSearch2: function(){
        var $this = this;
        this.config.url = seo_config.url;
        this.config.slash = seo_config.slash;
        if(typeof mSearch2 != "undefined" && typeof mSearch2.Hash != "undefined"){
            mSearch2.Hash.set = function(vars) {
                var hash = '', hash_al = '', hash_get = ''; var vars_arr = [];
                var curr_path = $(mSearch2.options.wrapper).data('url')||$this.config.url;
                var tarray = [];
                for (var i in vars) {
                    var vars_tmp = '';
                    if (vars.hasOwnProperty(i)) {
                        vars_tmp = '-'+vars[i];
                        tarray.push(i + '-' + $this.transliterate(vars_tmp.substr(1)));
                    }
                }
                if(tarray.length > 0){
                    hash += tarray.join("/");
                    if(typeof $this.config.slash != "undefined" && $this.config.slash){
                        hash += '/';
                    }
                }
                if(hash == ""){
                    if(typeof $this.config.slash == "undefined" || !$this.config.slash){
                        var temp = curr_path.split("/");
                        if(temp.length > 0){
                            curr_path = '';
                            for(var i = 0; i < temp.length; i++){
                                if(temp[i]){
                                    curr_path += curr_path?'/'+temp[i]:temp[i];
                                }
                            }
                        }
                    }
                }
                $this.vars = [curr_path,hash];
            };
        }
    }
    ,mSearch2HashSet: function() {
        if (!mSearch2.Hash.oldbrowser()) {
            window.history.pushState({mSearch2: this.vars[0] + this.vars[1]}, '', this.vars[0] + this.vars[1]);
        }
        else {
            window.location.hash = this.vars[1];
        }
    }
    ,transliterate: function(text) {
        var x;
        var translit = true;
        for(x = 0; x < this.config.rus.length; x++) {
                text = text.split(!translit ? this.config.eng[x] : this.config.rus[x]).join(!translit ? this.config.rus[x] : this.config.eng[x]);
                text = text.split(!translit ? this.config.eng[x].toUpperCase() : this.config.rus[x].toUpperCase()).join(!translit ? this.config.rus[x].toUpperCase() : this.config.eng[x].toUpperCase());	
        }
        text = text.replace(/ /g,"_");
        return text.toLowerCase();
    }
}

$(document).ready(function(){
    seo_mse2.load_mSearch2();
    $(document).on('mse2_load', function(e, response) {
        seo_mse2.run();
    });
    $(document).on('pdopage_load',function(e, response) {
        //console.log(e,response);
    });
});