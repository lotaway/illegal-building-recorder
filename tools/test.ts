function decorator(targetObj: TargetObj, targetKey: keyof TargetObj) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const _descVal = descriptor.value;

        descriptor.value = (obj) => {

        }
    }
}

interface TargetObj extends Object {

}

class Cs {
    // @decorator("two")
    static fn(obj: { two: string, one: number }) {
        //  ...do something
    }
}

Cs.fn({one: 1, two: "2"});