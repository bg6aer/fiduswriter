import {DocxExporter} from "../../exporter/docx"
import {OdtExporter} from "../../exporter/odt"

export class ModStyles {
    constructor(editor) {
        editor.mod.styles = this
        this.editor = editor
        this.exportTemplates = []
        this.documentStyles = []
        this.citationStyles = []
        this.citationLocales = []
    }


    setStyles(styles) {
        this.exportTemplates = styles.export_templates
        this.documentStyles = styles.document_styles
        this.citationStyles = styles.citation_styles
        this.citationLocales = styles.citation_locales
        this.addExportTemplateMenuEntries()
        this.addDocumentStylesMenuEntries()
        this.addCitationStylesMenuEntries()
        if (this.editor.menu.headerView) {
            this.editor.menu.headerView.update()
        }
    }

    addExportTemplateMenuEntries() {
        let exportMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id==='export')
        // Remove any previous entries in case we run this a second time
        exportMenu.content = exportMenu.content.filter(menuItem => menuItem.class!=='export_template')
        let exportMenuEntries = this.exportTemplates.map(template => {
            if(template.file_type==='docx') {
                return {
                    class: 'export_template',
                    title: `${template.file_name} (DOCX)`,
                    type: 'action',
                    tooltip: gettext('Export the document to a DOCX file with the given template.'),
                    action: editor => {
                        new DocxExporter(
                            editor.getDoc({changes: 'acceptAllNoInsertions'}),
                            template.template_file,
                            editor.mod.db.bibDB,
                            editor.mod.db.imageDB,
                            editor.mod.styles.citationStyles,
                            editor.mod.styles.citationLocales
                        )
                    }
                }
            } else {
                return {
                    class: 'export_template',
                    title: `${template.file_name} (ODT)`,
                    type: 'action',
                    tooltip: gettext('Export the document to an ODT file with the given template.'),
                    action: editor => {
                        new OdtExporter(
                            editor.getDoc({changes: 'acceptAllNoInsertions'}),
                            template.template_file,
                            editor.mod.db.bibDB,
                            editor.mod.db.imageDB,
                            editor.mod.styles.citationStyles,
                            editor.mod.styles.citationLocales
                        )
                    }
                }
            }
        })
        exportMenu.content = exportMenu.content.concat(exportMenuEntries)
    }

    addDocumentStylesMenuEntries() {
        let settingsMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id==='settings'),
            documentStyleMenu = settingsMenu.content.find(menu => menu.id==='document_style')

        documentStyleMenu.content = this.documentStyles.map(docStyle => {
            return {
                title: docStyle.title,
                type: 'setting',
                action: editor => {
                    let article = editor.view.state.doc.firstChild
                    let attrs = Object.assign({}, article.attrs)
                    attrs.documentstyle = docStyle.filename
                    editor.view.dispatch(
                        editor.view.state.tr.setNodeMarkup(0, false, attrs)
                    )
                },
                selected: editor => {
                    return editor.view.state.doc.firstChild.attrs.documentstyle === docStyle.filename
                }
            }
        })
    }

    addCitationStylesMenuEntries() {
        let settingsMenu = this.editor.menu.headerbarModel.content.find(menu => menu.id==='settings'),
            citationStyleMenu = settingsMenu.content.find(menu => menu.id==='citation_style')

        citationStyleMenu.content = this.citationStyles.map(citeStyle => {
            return {
                title: citeStyle.title,
                type: 'setting',
                action: editor => {
                    let article = editor.view.state.doc.firstChild
                    let attrs = Object.assign({}, article.attrs)
                    attrs.citationstyle = citeStyle.short_title
                    editor.view.dispatch(
                        editor.view.state.tr.setNodeMarkup(0, false, attrs)
                    )
                },
                selected: editor => {
                    return editor.view.state.doc.firstChild.attrs.citationstyle === citeStyle.short_title
                }
            }
        })
    }

}
