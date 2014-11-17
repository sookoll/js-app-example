define(['jquery', 'proj4', 'leaflet', 'proj4leaflet', 'jquery.bootstrap'], function($, proj4, L) {
    
    $(function(){

        'use strict';

        var coords = $('.coords'),
            active_layer = null;
        var crs = new L.Proj.CRS.TMS('EPSG:3301',
            '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
            [40500,5993000,1064500,7017000],
            {
                bounds: L.bounds([[40500,5993000],[1064500,7017000]]),
                origin: [40500,5993000],
                resolutions: [
                    4000.0, 2000.0, 1000.0, 500.0, 250.0, 125.0, 62.5, 31.25, 15.625, 7.8125, 3.90625,
                    1.953125, 0.9765625, 0.48828125, 0.244140625, 0.122070313, 0.061035157]
            }
        );

        var map = L.map('map', {
            crs: crs,
            maxZoom: 16,
            minZoom: 2,
        }).setView([58.5,25.5], 3);

        var baselayers = {
            map: {
                title: 'Kaart',
                active: true,
                layers: [
                    // tile kaart 0
                    new L.tileLayer('proxy.php?url=http://tiles.maaamet.ee/tm/s/1.0.0/kaart/{z}/{x}/{y}.png', {
                        id: 1,
                        maxZoom: 12,
                        minZoom: 2,
                        continuousWorld: true,
                        attribution: '&copy; Maa-amet',
                        tms: true
                    }),
                    // wms kaart 1
                    L.tileLayer.wms('http://kaart.maaamet.ee/wms/kaart?', {
                        id: 2,
                        layers: 'MA-KAART',
                        format: 'image/png',
                        transparent: true,
                        maxZoom: 16,
                        minZoom: 13,
                        continuousWorld: true,
                        attribution: '&copy; 2014 Maa-amet'
                    })
                ]
            },
            photo: {
                title: 'Foto',
                active: false,
                layers: [
                    // tile foto 2
                    new L.tileLayer('proxy.php?url=http://tiles.maaamet.ee/tm/s/1.0.0/foto/{z}/{x}/{y}.jpg', {
                        id: 3,
                        maxZoom: 12,
                        minZoom: 2,
                        continuousWorld: true,
                        attribution: '&copy; Maa-amet',
                        tms: true
                    }),
                    // wms foto 3
                    new L.tileLayer.wms('http://kaart.maaamet.ee/wms/fotokaart?', {
                        id: 4,
                        layers: 'EESTIFOTO',
                        format: 'image/png',
                        transparent: true,
                        maxZoom: 16,
                        minZoom: 13,
                        continuousWorld: true,
                        attribution: '&copy; Maa-amet'
                    })
                ]
            }
        };

        switchBaseLayer();
        createLayerSwitcher();

        map.on({
            mousemove: function(e){
                coords.html((e.latlng.lat.toFixed(4)) + ', ' + (e.latlng.lng.toFixed(4)));
            },
            zoomend: function(e){
                toggleLayerType();
            },
            baselayerchange: function(e){
                for (var i in baselayers){
                    console.log(baselayers[i],map.hasLayer(baselayers[i]));
                }
            }
        });

        function switchBaseLayer() {
            var z = map.getZoom(),
                layers;
            for(var key in baselayers){
                layers = baselayers[key].layers;
                for(var i=0, len=layers.length; i<len; i++){
                    if(layers[i] && map.hasLayer(layers[i])){
                        map.removeLayer(layers[i]);
                    }
                    if(layers[i] && z >= layers[i].options.minZoom && z <= layers[i].options.maxZoom && baselayers[key].active){
                        map.addLayer(layers[i]);
                        active_layer = layers[i];
                    }
                }
            }
        }

        function toggleLayerType() {
            var z = map.getZoom();

            if(active_layer && z >= active_layer.options.minZoom && z <= active_layer.options.maxZoom)
                return false;
            var layers;
            for(var key in baselayers){
                if(!baselayers[key].active){
                    continue;
                }
                layers = baselayers[key].layers;
                for(var i=0, len=layers.length; i<len; i++){
                    if(layers[i] && map.hasLayer(layers[i])){
                        map.removeLayer(layers[i]);
                    }
                    if(layers[i] && z >= layers[i].options.minZoom && z <= layers[i].options.maxZoom){
                        map.addLayer(layers[i]);
                        active_layer = layers[i];
                    }
                }
            }
        }

        function createLayerSwitcher(){
            var ul = $('<ul class="layer-switcher btn-group"></ul>'),
                li = $('<li class="btn btn-default"></li>'),
                _li;
            for(var key in baselayers){
                _li = li.clone();
                _li.attr('data-id',key)
                    .html(baselayers[key].title);
                if(baselayers[key].active)
                    _li.addClass('active');
                ul.append(_li);
            }
            // events
            ul.find('li').on('click', function(){
                ul.find('li').removeClass('active');
                $(this).addClass('active');
                var id = $(this).attr('data-id');
                for(var key in baselayers){
                    baselayers[key].active = false;
                }
                baselayers[id].active = true;
                switchBaseLayer();
            });
            ul.insertAfter('#map');
        }

    });
    
});