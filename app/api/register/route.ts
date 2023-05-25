import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prisma from "@/lib/prismadb";




export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log(error, 'REGISTRATION_ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}