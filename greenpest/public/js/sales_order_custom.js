// ###############################################################################
// #  quotation_custom.js
// ###############################################################################
// #   This code is for Create Pre Production Dimension
// #
// #   History:
// #        30-05-2024  Sopheak    Created
// ###############################################################################
frappe.ui.form.on('Sales Order', {
    get_data_schedule(frm) {
        frappe.call({
            method: 'greenpest.greenpest.api.get_data_schedule',
            args: {
                schedule_name: frm.doc.custom_maintenance_schedule_name.map(i => i.maintenance_schedule_name),
                page_num: 1
            },
            callback: (r) => {
                let res = r.message
                $(res).appendTo(frm.fields_dict.custom_maintenance_schedule_table.$wrapper.empty());
            }
        })
    },
    // End Function 

    // ###############################################################################
    // # This function use for create Pre Production Dimension on Quotation 
    // # Request:
    // #   
    // # Response:
    // #   
    // # Taks:
    // #    
    // # History
    // # 30-05-2024  Sopheak    Created
    // ###############################################################################
    //Click button Create Pre Dimension show form Production 
    custom_create_maintenance_schedule(frm) {
        let items = frm.doc.items
        let d_new = new frappe.ui.Dialog({
            title: __('Maintenance Schedule'),
            fields: [
                {
                    label: __('Customer'),
                    fieldname: 'customer',
                    fieldtype: 'Link',
                    options: 'Customer'
                },
                {
                    fieldtype: "Column Break",
                    fieldname: "col_break_1",
                },
                {
                    label: __('Transaction Date'),
                    fieldname: 'transaction_date',
                    fieldtype: 'Date',
                    reqd: 1,
                },
                {
                    fieldname: 'section_items',
                    fieldtype: 'Section Break',
                },
                {
                    label: __('Items'),
                    fieldname: 'items',
                    fieldtype: 'Table',
                    reqd: 1,
                    cannot_add_rows: false,
                    data: [],
                    fields: [
                        {
                            fieldname: 'item_code',
                            label: __('Item Code'),
                            fieldtype: 'Link',
                            in_list_view: 1,
                            options: 'Item',
                            reqd: 1,
                        },
                        {
                            fieldname: 'item_name',
                            label: __('Item Name'),
                            fieldtype: 'Data',
                            read_only: 1,
                        },
                        {
                            fieldtype: "Column Break",
                            fieldname: "col_break_2",
                        },
                        {
                            fieldname: 'start_date',
                            label: __('Start Date'),
                            fieldtype: 'Date',
                            in_list_view: 1,
                            reqd: 1,
                        },
                        {
                            fieldname: 'end_date',
                            label: __('End Date'),
                            fieldtype: 'Date',
                            in_list_view: 1,
                            reqd: 1,
                        },
                        {
                            fieldname: 'periodicity',
                            label: __('Periodicity'),
                            fieldtype: 'Select',
                            in_list_view: 1,
                            options: ["", "Weekly", "Monthly", "Quarterly", "Half Yearly", "Yearly", "Random"]
                        },
                        {
                            fieldname: 'section_items',
                            fieldtype: 'Section Break',
                        },
                        {
                            fieldname: 'no_of_visits',
                            label: __('No of Visits'),
                            fieldtype: 'Int',
                            in_list_view: 1,
                            reqd: 1,
                        },
                        {
                            fieldtype: "Column Break",
                            fieldname: "col_break_3",
                        },
                        {
                            fieldname: 'sales_person',
                            label: __('Sales Person'),
                            fieldtype: 'Link',
                            in_list_view: 1,
                            options: 'Sales Person'
                        },
                    ]
                },

            ],
            size: 'extra-large',
            primary_action_label: __('Save'),
            primary_action(values) {
                frappe.call({
                    method: 'greenpest.greenpest.api.create_update_schedule',
                    args: {
                        data: { ...values, name: frm.doc.name }
                    },
                    freeze: true,
                    callback: (r) => {
                        console.log(r.message)
                    }
                })
                // d_new.hide();
            },
        });
        d_new.show()
    },
    // End Function 
    refresh(frm) {
        if (!frm.is_new()) {
            //Show row table html
            frm.trigger('get_data_schedule');
        }
    }
})