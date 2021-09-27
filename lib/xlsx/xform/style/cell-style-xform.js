const BaseXform = require('../base-xform');
const utils = require('../../../utils/utils');

// Style assists translation from style model to/from xlsx
class CellStyleXform extends BaseXform {
  get tag() {
    return 'cellStyle';
  }

  prepare(model, options) {
    model.xfId = options.styles.addStyleModel(model.style);
    options.styles.addCellStyle(model);
  }

  render(xmlStream, model) {
    xmlStream.openNode('cellStyle', {
      xfId: model.xfId,
      builtinId: model.builtinId,
      iLevel: model.iLevel,
      name: model.name,
    });

    if (model.customBuiltin) {
      xmlStream.addAttribute('customBuiltin', '1');
    }
    if (model.hidden) {
      xmlStream.addAttribute('hidden', '1');
    }

    xmlStream.closeNode();
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    // used during sax parsing of xml to build font object
    switch (node.name) {
      case 'cellStyle':
        this.model = {
          xfId: parseInt(node.attributes.xfId, 10),
        };

        if (node.attributes.builtinId !== undefined) {
          this.model.builtinId = parseInt(node.attributes.builtinId, 10);
        }

        if (node.attributes.customBuiltin !== undefined) {
          this.model.customBuiltin = utils.parseBoolean(node.attributes.customBuiltin);
        }

        if (node.attributes.hidden !== undefined) {
          this.model.hidden = utils.parseBoolean(node.attributes.hidden);
        }

        if (node.attributes.iLevel !== undefined) {
          this.model.iLevel = parseInt(node.attributes.iLevel, 10);
        }

        if (node.attributes.name !== undefined) {
          this.model.name = node.attributes.name;
        }

        return true;
      default:
        return false;
    }
  }

  parseText(text) {}

  parseClose(name) {
    return false;
  }

  reconcile(model, options) {
    model.style = options.styles.getStyleModel(model.xfId);
    if (model.xfId !== undefined) {
      model.xfId = undefined;
    }
  }
}

module.exports = CellStyleXform;
