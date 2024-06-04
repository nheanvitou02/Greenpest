import frappe
import json
from frappe import ValidationError

doctype_maintenance_schedule = "Maintenance Schedule"
doctype_sales_order = "Sales Order"


@frappe.whitelist()
def get_data_schedule(schedule_name, page_num=1):
    schedule_name = json.loads(schedule_name)
    data_schedule = frappe.db.get_all(
        doctype_maintenance_schedule,
        fields=["name", "customer", "transaction_date", "status"],
        filters={"name": ["in", schedule_name]},
    )
    html = frappe.render_template(
        "greenpest/templates/table_schedule.html",
        {"page_num": page_num, "data": data_schedule},
    )

    return html


@frappe.whitelist()
def create_update_schedule(data):
    data = json.loads(data)
    try:
        doc_sc = frappe.new_doc(doctype_maintenance_schedule)
        doc_sc.customer = data.get("customer")
        doc_sc.transaction_date = data.get("transaction_date")
        for i in data.get("items"):
            doc_sc.append(
                "items",
                {
                    "item_code": i.get("item_code"),
                    "start_date": i.get("start_date"),
                    "end_date": i.get("end_date"),
                    "periodicity": i.get("periodicity"),
                    "no_of_visits": int(i.get("no_of_visits")),
                },
            )
        doc_sc.insert()

        doc_so = frappe.get_doc(doctype_sales_order, data.get("name"))
        doc_so.append(
            "custom_maintenance_schedule_name",
            {"maintenance_schedule_name": doc_sc.name},
        )
        doc_so.save()
    except ValidationError as exc:
        pass
    return doc_so
