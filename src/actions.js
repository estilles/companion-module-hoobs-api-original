module.exports = {
    initActions() {
        const actions = {};

        const choicesByType = (selectedType) => this.accessories.filter(accessory => (
            accessory.characteristics.find(({ type }) => type === selectedType)
        )).map(({ id, name }) => ({ id, label: name }))
    
        const accessoryChoices = (type) => ({
            type: 'dropdown',
            label: 'Accessory',
            id: 'id',
            default: choicesByType(type)[0].id,
            choices: choicesByType(type)
        });
    
        actions.on = {
            label: 'Accessory Power',
            options:  [
                accessoryChoices('on'),
                {
                    type: 'checkbox',
                    label: 'On',
                    id: 'value',
                    default: true,
                }
            ],
        };
    
        actions.brightness = {
            label: 'Accessory Brightness',
            options: [
                accessoryChoices('brightness'),
                {
                    type: 'number',
                    label: 'Brightness',
                    id: 'value',
                    min: this.BRIGHTNESS_MIN,
                    max: this.BRIGHTNESS_MAX,
                    default: this.BRIGHTNESS_MAX,
                    range: true,
                }
            ]
        }
    
        actions.color_temperature = {
            label: 'Accessory Color Temperature',
            options: [
                accessoryChoices('color_temperature'),
                {
                    type: 'dropdown',
                    label: 'Color Temperature',
                    id: 'value',
                    default: this.MIRED_MIN,
                    choices: this.TEMP_CHOICES,
                }
            ]
        }

        this.setActions(actions);
    },

    action({ action, options }) {
        const accessory = this.accessories.find(({ id }) => id === options.id);
        const value = action === 'on' ? options.value : parseInt(options.value);

        console.log(action, options)
    
        if (!accessory) {
            this.log('warn', 'accessory not found' );
            return;
        }
        const { aid, iid } = accessory.characteristics.find(({ type }) => type === action);
        this.controller.controlAccessory({ aid, iid, value });
    }
}
