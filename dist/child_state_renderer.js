import { createTableData } from "./utils.js";
export class ChildStateRenderer {
    constructor(tbody, span) {
        this.tbody = tbody;
        this.span = span;
    }
    render(absentMembers) {
        this.tbody.innerHTML = "";
        absentMembers.forEach((member) => {
            let tableRow = document.createElement("tr");
            const tableData = createTableData([
                member.nameInJapanese.lastName,
                member.nameInJapanese.firstName,
                member.childrenState.numChildren.toString(),
                member.childrenState.numAbsentChildren.toString()
            ]);
            tableData.forEach(data => tableRow.append(data));
            this.tbody.append(tableRow);
        });
        this.span.textContent = absentMembers.length.toString();
    }
}
//# sourceMappingURL=child_state_renderer.js.map