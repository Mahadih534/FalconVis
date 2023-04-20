import { Graph } from "./Graph.js"

class StackedBarGraph {
    constructor(parent_id, title, plotOptions, dataOptions, modal, editable = true, fullScreen = false, normalizeGraph = false) {
        this.uuid = Math.random().toString(36).substr(2, 9)

        this.modal = modal

        this.companionDiv = document.createElement("div")
        this.companionDiv.classList.add("p-4", "border-2", "border-gray-200", "rounded-lg", (fullScreen ? "w-full" : "w-[400px]"))
        this.companionDiv.id = this.uuid

        document.getElementById(parent_id).appendChild(this.companionDiv)
        
        this.companionDiv.setAttribute("type", "button")
        this.companionDiv.setAttribute("data-modal-toggle", this.uuid)

        var self = this
        if (editable) {
            document.getElementById(this.uuid).addEventListener("click", function () {
                self.setupEdit()
                document.getElementById('fakeToggle').click()
            })
        }

        this.fields = dataOptions.fields,
        this.colors = dataOptions.colors,
        this.formula = dataOptions.formula

        this.selectedColumnOptions = dataOptions.selectedOptions
        this.allColumnOptions = dataOptions.allOptions

        this.filter = 3

        this.generateData()

        this.graph = new Graph(
            this.uuid,
            {
                chart: {
                    type: 'bar',
                    stacked: true,
                    stackType: normalizeGraph ? '100%' : 'normal',
                    zoom: {
                        enabled: true
                    },
                    animations: {
                        enabled: false
                    }
                },
                plotOptions: plotOptions,
                series: this.seriesOptions,
                title: {
                    text: title,
                    align: 'left'
                },
                xaxis: {
                    categories: this.selectionOptionsToString(),
                },
                fill: {
                    colors: this.colors
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'center',
                    markers: {
                        fillColors: this.colors,
                    }
                }
            }
        )

        this.generateFilters()

    }

    generateData() {
        this.seriesOptions = []
        var dataByColumnOptions = []

        for (const selected of this.selectedColumnOptions) {
            dataByColumnOptions.push(
                this.formula(selected),
            )
        }
        
        for (let idx = 0; idx < this.fields.length; idx++) {
            this.seriesOptions.push(
                {
                    name: this.fields[idx],
                    data: dataByColumnOptions.map(x => x[idx])
                }
            )
        }
        console.log(this.seriesOptions)
    }

    selectionOptionsToString(){
        var stringed = []
        for (const team of this.selectedColumnOptions){
            stringed.push(team.toString());
        }
        return stringed
    }

    setupEdit() {
        var formString = ``

        var self = this
        this.modal.setCallBackClose(function () {
            self.pushEdit()
        })

        for (const i of this.allColumnOptions) {
            if (this.selectedColumnOptions.includes(i)) {
                formString += `
                <div class="flex items-center">
                    <input checked id="${i}${this.uuid}" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label id="for="${i}${this.uuid}" class="ml-2 text-sm font-medium text-gray-300">${i}</label>
                </div>
                `
            }
            else {
                formString += `
                <div class="flex items-center">
                    <input id="${i}${this.uuid}" type="checkbox" value="" class="w-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label for="${i}${this.uuid}" class="ml-2 text-sm font-medium text-gray-300">${i}</label>
                </div>
                `
            }
        }

        this.modal.formHTML = formString

    }

    pushEdit(modal = true, x = []) {
        if (modal){
            this.selectedColumnOptions = []
            for (const i of this.allColumnOptions) {
                if (document.getElementById(i.toString() + this.uuid.toString()).checked) {
                    this.selectedColumnOptions.push(i)
                }
            }
        }
        else {
            this.selectedColumnOptions = x
        }

        this.generateData()

        this.graph.state.series = this.seriesOptions
        this.graph.state.xaxis.categories = this.selectionOptionsToString()

        this.graph.update()

    }

    generateFilters(){
        var self = this

        document.getElementById(this.uuid).innerHTML = `
        <div class="h-10 flex flex-row gap-4">
            <button class="h-8 w-16 pt-[2px] border-2 border-red-600 text-red-600 font-bold rounded-md text-center" id="${this.uuid}section1">
                1-25
            </button>
            <button class="h-8 w-16 pt-[2px] border-2 border-orange-500 text-orange-500 font-bold rounded-md text-center" id="${this.uuid}section2">
                25-50
            </button>
            <button class="h-8 w-16 pt-[2px] border-2 border-green-600 text-green-600 font-bold rounded-md text-center" id="${this.uuid}section3">
                50-75
            </button>
            <button class="h-8 w-16 pt-[2px] border-2 border-blue-600 text-blue-600 font-bold rounded-md text-center" id="${this.uuid}section4">
                75-99
            </button>
        </div>
        `

        for (const section of [1, 2, 3, 4]){
            document.getElementById(this.uuid + `section${section}`).addEventListener("click", function () {
                self.filter = (5 - section) - 1
                self.pushEdit(false, self.allColumnOptions)
            })
        }

        console.log(this.companionDiv.innerHTML)
    }
}


export { StackedBarGraph }