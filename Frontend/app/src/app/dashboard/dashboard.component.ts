import { Component, OnInit } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  options: GridsterConfig;
  items: Array<GridsterItem>;
  editMode: boolean;

  constructor() { }


  static itemChange(item: any, itemComponent: any) {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item: any, itemComponent: any) {
    console.info('itemResized', item, itemComponent);
  }

  ngOnInit(): void {
    this.options = {
      itemChangeCallback: DashboardComponent.itemChange,
      itemResizeCallback: DashboardComponent.itemResize,
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.Always,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      disableWindowResize: true,
      draggable: {
        enabled: true
      },
      pushItems: true,
      resizable: {
        enabled: true
      }
    }

    this.items = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2 }
    ]
  }

  changedOptions() {
    this.options.api?.optionsChanged?.();
  }

  removeItem(item: any) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  addItem() {
    this.items.push({ cols: 1, rows: 1, y: 0, x: 0 });
  }

  enableEditMode() {
    this.editMode = true;
  }

  saveChanges() {
    this.editMode = false;
  }

  discardChanges() {
    this.editMode = false;
  }
}
