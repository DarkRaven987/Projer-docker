import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TasksStatus } from "../tasks-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TasksStatus.OPEN,
        TasksStatus.IN_PROGRESS,
        TasksStatus.TESTING,
        TasksStatus.DONE,
    ]

    transform(value: any) {
        value = value.toUpperCase();

        if (!this.validateStatuseValue(value)) {
            throw new BadRequestException(`'${value}' si an invalid status value. `);
        }

        return value;
    }

    private validateStatuseValue(value: any) {
        return this.allowedStatuses.indexOf(value) !== -1;
    }
}