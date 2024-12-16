import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Download, Github, Twitter, CheckCircle, Users, Zap, Globe, ExternalLink } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react'

export default function InfoPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="container mx-auto px-8 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your GHL Dashboard</h1>
        <p className="text-xl text-muted-foreground">Discover how we can revolutionize your workflow</p>
      </header>

      <main>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About GHL</CardTitle>
            <CardDescription>The CRM that can do almost anything</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our app is designed to streamline your daily tasks, boost productivity, and make your life easier. 
              With cutting-edge features and an intuitive interface, you'll wonder how you ever managed without it.
            </p>
            <div className="flex justify-center space-x-4">
              <Button>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                GHL Academy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="features" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="pricing">Suggested Pricing</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>What sets our app apart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">New</Badge>
                  <span>AI-powered task management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Popular</Badge>
                  <span>Real-time collaboration tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Enhanced</Badge>
                  <span>Advanced analytics dashboard</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Flexible Pricing Options</CardTitle>
                <CardDescription>Choose the plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• Free Tier: Perfect for individuals</p>
                <p>• Pro Tier: Ideal for small teams</p>
                <p>• Enterprise: Customized for large organizations</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View Full Pricing</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">How secure is my data?</p>
                <p className="text-muted-foreground mb-2">We use industry-standard encryption to keep your data safe and secure.</p>
                <Separator className="my-2" />
                <p className="font-medium">Can I cancel my subscription anytime?</p>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time with no hidden fees.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>GHL in Action</CardTitle>
            <CardDescription>Watch our quick demo video</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="App Demo Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* New section: How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding our app's workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger>1. Sign Up</AccordionTrigger>
                <AccordionContent>
                  Create your account in minutes. Choose your plan and get started with our easy onboarding process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step2">
                <AccordionTrigger>2. Set Up Your Workspace</AccordionTrigger>
                <AccordionContent>
                  Customize your dashboard, invite team members, and configure your preferences to suit your workflow.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step3">
                <AccordionTrigger>3. Start Collaborating</AccordionTrigger>
                <AccordionContent>
                  Use our real-time collaboration tools to work on projects, share ideas, and boost productivity with your team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step4">
                <AccordionTrigger>4. Analyze and Improve</AccordionTrigger>
                <AccordionContent>
                  Leverage our advanced analytics to gain insights into your team's performance and continuously improve your processes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>


        {/* New section: Integration Partners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Seamlessly connect with your client's favorite tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <img src="/Slack-logo.png" alt="Slack" className="mb-2 rounded-lg" height="200" width="200"/>
                <span>Slack</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/placeholder.svg?height=50&width=50" alt="Google Drive" className="mb-2" />
                <span>Google Drive</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/placeholder.svg?height=50&width=50" alt="Trello" className="mb-2" />
                <span>Trello</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/placeholder.svg?height=50&width=50" alt="Dropbox" className="mb-2" />
                <span>Dropbox</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New section: Why Choose Us */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why GHL?</CardTitle>
            <CardDescription>The benefits of using our app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Increased Productivity</h3>
                  <p className="text-sm text-muted-foreground">Streamline your workflow and get more done</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Work together seamlessly, no matter where you are</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Powerful Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect with your favorite tools effortlessly</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Globe className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Global Accessibility</h3>
                  <p className="text-sm text-muted-foreground">Access your work from anywhere, anytime</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Get Started?</CardTitle>
            <CardDescription>Join thousands of satisfied users today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
                    <Zap className="mr-2 h-4 w-4" /> Activate a GHL Subaccount
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Activate GHL Subaccount</DialogTitle>
                    <DialogDescription>
                      Fill out this form to activate your GHL subaccount
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-[70vh]">
                    <iframe
                      src="https://forms.fillout.com/t/fpSjX2ydN8us"
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '10px',
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full sm:w-auto">
                <ExternalLink className="mr-2 h-4 w-4" /> GHL Dashboard
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

