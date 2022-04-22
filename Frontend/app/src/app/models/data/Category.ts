export class CategoryModel {
    name: string;
    children: CategoryModel[];

    public static unroll(cm: CategoryModel): CategoryModel[] {
        let children = cm.children.map(c => this.unroll(c)).flat();
        children.push(cm);
        return children;
    }
}