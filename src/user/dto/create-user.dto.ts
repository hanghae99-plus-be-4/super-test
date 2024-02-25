import { IsEmail, IsString, MaxLength } from 'class-validator';
export class CreateUserDto {

    @IsString()
    @MaxLength(20)
    readonly name: string;

    @IsEmail()
    @MaxLength(40)
    readonly email: string;

    @IsString()
    @MaxLength(20)
    readonly password: string;
}