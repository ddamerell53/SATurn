package saturn.client.programs.phylo;
class PhyloLegendRowWidget {
    var legend : PhyloLegendWidget;
    var config : PhyloAnnotationConfiguration;

    var container : Dynamic;

    public function new(legend : PhyloLegendWidget, config : PhyloAnnotationConfiguration) {
        this.legend = legend;
        this.config = config;

        build();
    }

    public function build(){
        addContainer();

        addLabel();
        addColourChooser();
    }

    public function addContainer(){
        container = js.Browser.document.createElement('div');

        legend.getLegendContainer().appendChild(container);
    }

    public function addLabel(){
        var label = js.Browser.document.createElement('span');
        label.innerText = config.name;
        label.style.color = 'green';

        container.appendChild(label);
    }

    public function addColourChooser(){
        var picker :Dynamic = js.Browser.document.createElement('input');

        picker.setAttribute('type', 'color');
        picker.setAttribute('name', 'line_colour_input');
        picker.setAttribute('value', config.colour);

        picker.style.width = '100px';
        picker.addEventListener('change', function(){
            config.colour = picker.value;

            legend.getCanvas().getAnnotationManager().reloadAnnotationConfigurations();
        });

        container.appendChild(picker);
    }
}
